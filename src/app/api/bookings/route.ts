import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBookingId, getDiscountMultiplier } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = session.user.role;
  const userId = session.user.id;

  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

  const where: any = {};

  if (role === "CUSTOMER") {
    where.customerId = userId;
  } else if (role === "WORKER") {
    where.workerId = userId;
  }

  if (status) {
    where.status = status;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        service: true,
        customer: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        worker: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        review: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, limit });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      serviceId,
      scheduledDate,
      timeSlot,
      address,
      workerId,
      problemPhotoUrl,
      problemDescription,
      isEmergency,
      paymentMethod,
      city,
      area,
      latitude,
      longitude,
    } = body;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
      include: { user: { include: { subscriptions: { where: { isActive: true } } } } },
    });

    const activeSub = customer?.user.subscriptions[0];
    const discountMultiplier = getDiscountMultiplier(activeSub?.tier || null);

    let visitCharge = service.baseCharge;
    let serviceCharge = visitCharge * 0.8;
    const totalAmount = visitCharge + serviceCharge;
    const discountAmount = activeSub ? totalAmount * (1 - discountMultiplier) : 0;
    const finalAmount = totalAmount - discountAmount;

    const booking = await prisma.booking.create({
      data: {
        bookingId: generateBookingId(),
        customerId: session.user.id,
        workerId: workerId || null,
        serviceId,
        scheduledDate: new Date(scheduledDate),
        timeSlot,
        address,
        city: city || null,
        area: area || null,
        latitude: latitude || null,
        longitude: longitude || null,
        visitCharge,
        serviceCharge,
        totalAmount,
        discountAmount,
        finalAmount,
        paymentMethod: paymentMethod || "CASH_ON_DELIVERY",
        problemPhotoUrl: problemPhotoUrl || null,
        problemDescription: problemDescription || null,
        isEmergency: isEmergency || false,
        statusHistory: {
          create: { status: "PENDING", note: "Booking created" },
        },
      },
      include: {
        service: true,
        statusHistory: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
