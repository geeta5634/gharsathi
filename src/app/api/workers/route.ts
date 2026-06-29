import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const area = searchParams.get("area");
  const search = searchParams.get("search");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const sortBy = searchParams.get("sortBy") || "rating";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = { isVerified: true };

  if (category) where.serviceCategory = category;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (area) where.area = { contains: area, mode: "insensitive" };
  if (search) {
    where.OR = [
      { bio: { contains: search, mode: "insensitive" } },
      { skills: { contains: search } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (minRating > 0) where.rating = { gte: minRating };

  const [workers, total] = await Promise.all([
    prisma.worker.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, phone: true, avatarUrl: true, createdAt: true },
        },
        reviews: {
          select: { rating: true, comment: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip,
    }),
    prisma.worker.count({ where }),
  ]);

  return NextResponse.json({ workers, total, page, limit });
}
