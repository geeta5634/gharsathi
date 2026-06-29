import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tier } = await request.json();
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.updateMany({
      where: { userId: session.user.id, isActive: true },
      data: { isActive: false },
    });

    const freeVisitsMap: Record<string, number> = {
      BASIC: 1,
      PREMIUM: 2,
      VIP: 4,
    };

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        tier,
        startDate: now,
        endDate,
        totalFreeVisits: freeVisitsMap[tier] || 0,
      },
    });

    if (session.user.role === "CUSTOMER") {
      await prisma.customer.update({
        where: { userId: session.user.id },
        data: { subscriptionTier: tier },
      });
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
