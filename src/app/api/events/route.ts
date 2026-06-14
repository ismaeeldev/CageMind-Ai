import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tab = searchParams.get("tab") === "past" ? "past" : "upcoming";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const startOfTodayUTC = new Date();
  startOfTodayUTC.setUTCHours(0, 0, 0, 0);

  const where =
    tab === "upcoming"
      ? { isUpcoming: true }
      : { isUpcoming: false, date: { lt: startOfTodayUTC } };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: tab === "upcoming" ? "asc" : "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        fights: {
          include: { fighter1: true, fighter2: true },
          orderBy: { isTitleFight: "desc" },
          take: 1,
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({
    events,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}
