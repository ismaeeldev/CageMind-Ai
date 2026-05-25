"use server";

import { prisma } from "@/lib/db";
import { getExpectedScore, getNewRating, generatePrediction } from "@/lib/elo";

/**
 * Resolves a fight, updating the Elo ratings for both fighters in a transaction.
 */
export async function resolveFight(
  fightId: string, 
  winnerId: string | null, 
  method?: string, 
  endingRound?: number, 
  endingTime?: string
) {
  // Fetch the fight and fighters
  const fight = await prisma.fight.findUnique({
    where: { id: fightId },
    include: {
      fighter1: true,
      fighter2: true,
    }
  });

  if (!fight) throw new Error("Fight not found");

  const { fighter1, fighter2 } = fight;

  // Calculate actual scores
  let score1 = 0.5;
  let score2 = 0.5;

  if (winnerId === fighter1.id) {
    score1 = 1;
    score2 = 0;
  } else if (winnerId === fighter2.id) {
    score1 = 0;
    score2 = 1;
  }

  // Calculate expected scores
  const expected1 = getExpectedScore(fighter1.eloRating, fighter2.eloRating);
  const expected2 = getExpectedScore(fighter2.eloRating, fighter1.eloRating);

  // Calculate new ratings
  const newRating1 = getNewRating(fighter1.eloRating, expected1, score1);
  const newRating2 = getNewRating(fighter2.eloRating, expected2, score2);

  // Update records in a transaction
  await prisma.$transaction([
    prisma.fighter.update({
      where: { id: fighter1.id },
      data: { 
        eloRating: newRating1,
        wins: winnerId === fighter1.id ? { increment: 1 } : undefined,
        losses: winnerId === fighter2.id ? { increment: 1 } : undefined,
        draws: winnerId === null ? { increment: 1 } : undefined,
        koWins: winnerId === fighter1.id && method?.includes("KO") ? { increment: 1 } : undefined,
        subWins: winnerId === fighter1.id && method?.includes("Sub") ? { increment: 1 } : undefined,
      }
    }),
    prisma.fighter.update({
      where: { id: fighter2.id },
      data: { 
        eloRating: newRating2,
        wins: winnerId === fighter2.id ? { increment: 1 } : undefined,
        losses: winnerId === fighter1.id ? { increment: 1 } : undefined,
        draws: winnerId === null ? { increment: 1 } : undefined,
        koWins: winnerId === fighter2.id && method?.includes("KO") ? { increment: 1 } : undefined,
        subWins: winnerId === fighter2.id && method?.includes("Sub") ? { increment: 1 } : undefined,
      }
    }),
    prisma.fight.update({
      where: { id: fight.id },
      data: {
        winnerId,
        method,
        endingRound,
        endingTime
      }
    })
  ]);

  return { success: true, newRating1, newRating2 };
}

/**
 * Attaches an AI Prediction to an existing fight based on current Elo ratings.
 */
export async function attachPredictionToFight(fightId: string) {
  const fight = await prisma.fight.findUnique({
    where: { id: fightId },
    include: { fighter1: true, fighter2: true }
  });

  if (!fight) throw new Error("Fight not found");

  const prediction = generatePrediction(fight.fighter1.eloRating, fight.fighter2.eloRating);
  const expectedWinnerName = prediction.expectedWinnerIndex === 1 
    ? fight.fighter1.name 
    : (prediction.expectedWinnerIndex === 2 ? fight.fighter2.name : "Draw");

  await prisma.fight.update({
    where: { id: fight.id },
    data: {
      aiPrediction: expectedWinnerName,
      aiConfidence: prediction.confidenceScore
    }
  });

  return prediction;
}
