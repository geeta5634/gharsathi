import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.healthRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { serviceDate: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const record = await prisma.healthRecord.create({
      data: {
        customerId: customer.id,
        userId: session.user.id,
        title: body.title,
        description: body.description,
        type: body.type,
        serviceDate: body.serviceDate ? new Date(body.serviceDate) : null,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        amount: body.amount || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create health record" },
      { status: 500 }
    );
  }
}
