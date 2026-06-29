import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: {
        select: { id: true, name: true, phone: true, avatarUrl: true },
      },
      worker: {
        select: { id: true, name: true, phone: true, avatarUrl: true },
      },
      review: true,
      payment: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, cancellationReason, workerId } = body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (cancellationReason) updateData.cancellationReason = cancellationReason;
  if (workerId) updateData.workerId = workerId;
  if (status === "COMPLETED") updateData.completedAt = new Date();

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...updateData,
      statusHistory: {
        create: {
          status: status || booking.status,
          note: status === "CANCELLED" ? cancellationReason : `Status updated to ${status}`,
        },
      },
    },
    include: {
      service: true,
      statusHistory: true,
    },
  });

  return NextResponse.json(updated);
}
