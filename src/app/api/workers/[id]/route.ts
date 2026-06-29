import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const worker = await prisma.worker.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, phone: true, avatarUrl: true, createdAt: true },
      },
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, avatarUrl: true } },
          booking: { select: { service: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
      availabilities: true,
      kycDocuments: {
        select: { id: true, type: true, status: true, createdAt: true },
      },
    },
  });

  if (!worker) {
    return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  }

  const neighborhoodRecs = await prisma.neighborhoodRecommendation.findMany({
    where: { workerId: id },
    orderBy: { count: "desc" },
  });

  return NextResponse.json({ ...worker, neighborhoodRecs });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const worker = await prisma.worker.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(worker);
}
