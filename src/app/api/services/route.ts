import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();

  const service = await prisma.service.create({
    data: {
      category: body.category,
      name: body.name,
      description: body.description,
      icon: body.icon,
      isEmergency: body.isEmergency || false,
      baseCharge: body.baseCharge || 0,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
