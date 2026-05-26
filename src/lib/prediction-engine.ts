import { prisma } from "./db";
import { Fighter } from "@/generated/prisma";

export interface PredictionResult {
  winProbabilityFighter1: number;
  winProbabilityFighter2: number;
  confidenceScore: number;
  summary: string;
}

export class PredictionEngine {
  private readonly WEIGHTS = {
    elo: 0.50,
    momentum: 0.25,
    physical: 0.15,
    career: 0.10
  };

  public async generatePrediction(fightId: string): Promise<PredictionResult> {
    const fight = await prisma.fight.findUnique({
      where: { id: fightId },
      include: { fighter1: true, fighter2: true, event: true }
    });

    if (!fight || !fight.fighter1 || !fight.fighter2) {
      throw new Error("Fight or fighters not found");
    }

    return this.generateHypotheticalPrediction(fight.fighter1, fight.fighter2, fight.event?.date);
  }

  public async generateHypotheticalPrediction(f1: Fighter, f2: Fighter, date?: Date): Promise<PredictionResult> {

    // 1. Elo Delta Calculation (Scale: -1 to 1)
    // 400 points difference roughly represents a 10x skill gap (normalized)
    const eloDiff = f1.eloRating - f2.eloRating;
    const eloScore = Math.max(-1, Math.min(1, eloDiff / 400));

    // 2. Momentum Calculation (Scale: -1 to 1)
    const f1Momentum = await this.calculateMomentum(f1.id, date || new Date());
    const f2Momentum = await this.calculateMomentum(f2.id, date || new Date());
    const momentumScore = f1Momentum - f2Momentum;

    // 3. Physical Delta Calculation (Scale: -1 to 1)
    let physicalScore = 0;
    let missingPhysicalData = false;
    
    if (f1.height && f2.height && f1.reach && f2.reach) {
      const heightDiffInches = f1.height - f2.height; // Assume normalized
      const reachDiffInches = f1.reach - f2.reach;
      
      // Cap max advantage at 6 inches
      const heightNorm = Math.max(-1, Math.min(1, heightDiffInches / 6));
      const reachNorm = Math.max(-1, Math.min(1, reachDiffInches / 6));
      
      physicalScore = (heightNorm * 0.4) + (reachNorm * 0.6);
    } else {
      missingPhysicalData = true;
    }

    // Age Penalty (Scale: -1 to 1)
    if (f1.age && f2.age) {
      const ageDiff = f2.age - f1.age; // Positive if f2 is older (f1 has advantage)
      // Cap at 10 years diff
      physicalScore += Math.max(-1, Math.min(1, ageDiff / 10)) * 0.5;
      physicalScore = Math.max(-1, Math.min(1, physicalScore)); // Re-normalize
    }

    // 4. Career Win Percentage (Scale: -1 to 1)
    const f1WinPct = this.calculateWinPct(f1);
    const f2WinPct = this.calculateWinPct(f2);
    const careerScore = f1WinPct - f2WinPct;

    // --- Final Weighted Delta Calculation ---
    const finalDeltaScore = 
      (eloScore * this.WEIGHTS.elo) +
      (momentumScore * this.WEIGHTS.momentum) +
      (physicalScore * this.WEIGHTS.physical) +
      (careerScore * this.WEIGHTS.career);

    // Convert Delta Score (-1 to 1) into a Probability Percentage using Sigmoid
    const k = 3; // Steepness
    const winProbF1 = 1 / (1 + Math.exp(-k * finalDeltaScore));
    const winProbF2 = 1 - winProbF1;

    // --- Confidence Score ---
    // Higher confidence if the delta is very large (lopsided)
    const absoluteDelta = Math.abs(finalDeltaScore);
    let confidence = 0.5 + (absoluteDelta * 0.5); 
    
    // Penalize confidence if we are missing physical data
    if (missingPhysicalData) {
      confidence *= 0.8;
    }

    // --- Generate Narrative Summary ---
    const summary = this.generateSummary(f1, f2, winProbF1, eloDiff, momentumScore, physicalScore, missingPhysicalData);

    return {
      winProbabilityFighter1: Number((winProbF1 * 100).toFixed(1)),
      winProbabilityFighter2: Number((winProbF2 * 100).toFixed(1)),
      confidenceScore: Number(confidence.toFixed(2)),
      summary
    };
  }

  private async calculateMomentum(fighterId: string, beforeDate: Date = new Date()): Promise<number> {
    const recentFights = await prisma.fight.findMany({
      where: {
        OR: [{ fighter1Id: fighterId }, { fighter2Id: fighterId }],
        event: {
          date: { lt: beforeDate }
        },
        winnerId: { not: null }
      },
      orderBy: { event: { date: 'desc' } },
      take: 5,
      include: { event: true }
    });

    if (recentFights.length === 0) return 0;

    let wins = 0;
    for (const f of recentFights) {
      if (f.winnerId === fighterId) wins++;
    }

    const winPct = wins / recentFights.length;
    // Normalize to -1 to 1
    return (winPct * 2) - 1;
  }

  private calculateWinPct(fighter: Fighter): number {
    const total = fighter.wins + fighter.losses + fighter.draws;
    if (total === 0) return 0;
    const pct = fighter.wins / total;
    return (pct * 2) - 1; // Normalize to -1 to 1
  }

  private generateSummary(
    f1: Fighter, 
    f2: Fighter, 
    winProbF1: number, 
    eloDiff: number, 
    momentumScore: number, 
    physicalScore: number,
    missingPhysical: boolean
  ): string {
    const favored = winProbF1 > 0.5 ? f1 : f2;
    const underdog = winProbF1 > 0.5 ? f2 : f1;
    const pct = Math.max(winProbF1, 1 - winProbF1) * 100;

    let narrative = `${favored.name} is favored to win with a ${pct.toFixed(1)}% probability. `;

    const reasons: string[] = [];

    // Elo Analysis
    if (Math.abs(eloDiff) > 50) {
      const eloAdv = eloDiff > 0 ? f1.name : f2.name;
      reasons.push(`a significant Elo advantage (+${Math.abs(eloDiff).toFixed(0)} points)`);
    }

    // Momentum Analysis
    if (Math.abs(momentumScore) > 0.4) {
      const momAdv = momentumScore > 0 ? f1.name : f2.name;
      reasons.push(`stronger recent momentum by ${momAdv}`);
    }

    // Physical Analysis
    if (!missingPhysical && Math.abs(physicalScore) > 0.3) {
      const physAdv = physicalScore > 0 ? f1.name : f2.name;
      reasons.push(`notable physical or age advantages for ${physAdv}`);
    }

    if (reasons.length > 0) {
      narrative += `This prediction is primarily driven by ${reasons.join(", and ")}. `;
    } else {
      narrative += `The metrics are incredibly close across the board, making this a highly competitive matchup. `;
    }

    return narrative;
  }
}
