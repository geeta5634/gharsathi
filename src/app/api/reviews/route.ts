import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId, rating, comment } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || !booking.workerId) {
      return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: session.user.id,
        workerId: booking.workerId,
        rating,
        comment,
      },
    });

    const reviews = await prisma.review.findMany({
      where: { workerId: booking.workerId },
      select: { rating: true },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.worker.update({
      where: { id: booking.workerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
