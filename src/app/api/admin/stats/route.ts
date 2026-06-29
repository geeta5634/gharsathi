import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    totalWorkers,
    totalCustomers,
    totalBookings,
    totalRevenue,
    recentBookings,
    bookingsByService,
    weeklyBookings,
    workersGrowth,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "WORKER" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({ _sum: { finalAmount: true } }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        customer: { select: { name: true, phone: true } },
        worker: { select: { name: true } },
      },
    }),
    prisma.booking.groupBy({
      by: ["serviceId"],
      _count: true,
      _sum: { finalAmount: true },
      orderBy: { _sum: { finalAmount: "desc" } },
    }),
    prisma.booking.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, finalAmount: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.groupBy({
      by: ["role"],
      where: {
        role: "WORKER",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _count: true,
    }),
  ]);

  const bookingsTrend = weeklyBookings.reduce<Record<string, { count: number; revenue: number }>>(
    (acc, b) => {
      const date = b.createdAt.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { count: 0, revenue: 0 };
      acc[date].count++;
      acc[date].revenue += b.finalAmount;
      return acc;
    },
    {}
  );

  const servicesWithNames = await Promise.all(
    bookingsByService.map(async (bs) => {
      const service = await prisma.service.findUnique({
        where: { id: bs.serviceId },
        select: { name: true },
      });
      return {
        name: service?.name || "Unknown",
        count: bs._count,
        revenue: bs._sum.finalAmount || 0,
      };
    })
  );

  return NextResponse.json({
    totalWorkers,
    totalCustomers,
    totalBookings,
    totalRevenue: totalRevenue._sum.finalAmount || 0,
    workersGrowth: workersGrowth[0]?._count || 0,
    recentBookings,
    bookingsByService: servicesWithNames,
    bookingsTrend: Object.entries(bookingsTrend).map(([date, data]) => ({
      date,
      ...data,
    })),
  });
}
