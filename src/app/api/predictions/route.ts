import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isPremium = session?.user?.isPremium === true;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const weightClass = searchParams.get("weightClass") || "";

    const take = 10;
    const skip = (page - 1) * take;

    const where: Prisma.FightWhereInput = {
      event: { isUpcoming: true },
      aiPrediction: { not: null } // Only fights that have been predicted
    };

    if (search) {
      where.OR = [
        { fighter1: { name: { contains: search, mode: "insensitive" } } },
        { fighter2: { name: { contains: search, mode: "insensitive" } } }
      ];
    }

    if (weightClass) {
      where.weightClass = weightClass;
    }

    const [fights, totalCount] = await Promise.all([
      prisma.fight.findMany({
        where,
        include: {
          fighter1: true,
          fighter2: true,
          event: true
        },
        orderBy: { event: { date: 'asc' } },
        take,
        skip
      }),
      prisma.fight.count({ where })
    ]);

    // Apply Server-Side Premium Protection
    const protectedFights = fights.map(fight => {
      if (!isPremium) {
        return {
          ...fight,
          aiPrediction: "LOCKED_PREMIUM",
          aiConfidence: null
        };
      }
      return fight;
    });

    return NextResponse.json({
      fights: protectedFights,
      totalPages: Math.ceil(totalCount / take),
      currentPage: page,
      isPremium
    });

  } catch (error: any) {
    console.error("Failed to fetch predictions", error);
    return NextResponse.json({ error: "Failed to load predictions" }, { status: 500 });
  }
}
