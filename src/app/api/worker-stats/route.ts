import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const worker = await prisma.worker.findUnique({
    where: { userId: session.user.id },
  });

  if (!worker) {
    return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayBookings,
    todayCompleted,
    totalEarnings,
    thisMonthEarnings,
    lastMonthEarnings,
    dailyEarnings,
    acceptedBookings,
    completedJobs,
  ] = await Promise.all([
    prisma.booking.count({
      where: { workerId: session.user.id, scheduledDate: { gte: today } },
    }),
    prisma.booking.count({
      where: {
        workerId: session.user.id,
        status: "COMPLETED",
        completedAt: { gte: today },
      },
    }),
    prisma.booking.aggregate({
      where: { workerId: session.user.id, paymentStatus: "PAID" },
      _sum: { finalAmount: true },
    }),
    prisma.booking.aggregate({
      where: {
        workerId: session.user.id,
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
        paymentStatus: "PAID",
      },
      _sum: { finalAmount: true },
    }),
    prisma.booking.aggregate({
      where: {
        workerId: session.user.id,
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          lt: new Date(today.getFullYear(), today.getMonth(), 1),
        },
        paymentStatus: "PAID",
      },
      _sum: { finalAmount: true },
    }),
    prisma.booking.findMany({
      where: {
        workerId: session.user.id,
        status: "COMPLETED",
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { completedAt: true, finalAmount: true },
      orderBy: { completedAt: "asc" },
    }),
    prisma.booking.count({
      where: { workerId: session.user.id, status: { not: "CANCELLED" } },
    }),
    prisma.booking.count({
      where: { workerId: session.user.id, status: "COMPLETED" },
    }),
  ]);

  const dailyBreakdown = dailyEarnings.reduce<
    Record<string, { count: number; earnings: number }>
  >((acc, b) => {
    const date = b.completedAt!.toISOString().split("T")[0];
    if (!acc[date]) acc[date] = { count: 0, earnings: 0 };
    acc[date].count++;
    acc[date].earnings += b.finalAmount;
    return acc;
  }, {});

  return NextResponse.json({
    todayBookings,
    todayCompleted,
    totalEarnings: totalEarnings._sum.finalAmount || 0,
    thisMonthEarnings: thisMonthEarnings._sum.finalAmount || 0,
    lastMonthEarnings: lastMonthEarnings._sum.finalAmount || 0,
    dailyBreakdown: Object.entries(dailyBreakdown).map(([date, data]) => ({
      date,
      ...data,
    })),
    acceptedBookings,
    completedJobs,
    totalJobs: acceptedBookings + completedJobs,
    rating: worker.rating,
    trustScore: worker.trustScore,
  });
}
