import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PredictionEngine } from "@/lib/prediction-engine";
import { logger } from "@/lib/logger";

// Fetch list of fighters for the dropdown selectors
export async function GET() {
  try {
    const fighters = await prisma.fighter.findMany({
      where: { isActive: true },
      select: { id: true, name: true, weightClass: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ fighters });
  } catch (error: any) {
    logger.error("Failed to fetch fighters for matchup", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Generate a hypothetical prediction for two fighters
export async function POST(req: Request) {
  try {
    const { fighter1Id, fighter2Id } = await req.json();

    if (!fighter1Id || !fighter2Id) {
      return NextResponse.json({ error: "Missing fighter IDs" }, { status: 400 });
    }

    if (fighter1Id === fighter2Id) {
      return NextResponse.json({ error: "Cannot fight themselves" }, { status: 400 });
    }

    const f1 = await prisma.fighter.findUnique({ where: { id: fighter1Id } });
    const f2 = await prisma.fighter.findUnique({ where: { id: fighter2Id } });

    if (!f1 || !f2) {
      return NextResponse.json({ error: "Fighters not found" }, { status: 404 });
    }

    const engine = new PredictionEngine();
    const prediction = await engine.generateHypotheticalPrediction(f1, f2);

    return NextResponse.json({
      fighter1: f1,
      fighter2: f2,
      prediction
    });
  } catch (error: any) {
    logger.error("Failed to generate matchup prediction", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
