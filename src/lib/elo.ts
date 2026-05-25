export const ELO_K_FACTOR = 32;

/**
 * Calculates the expected score (win probability) for Fighter A.
 * @param ratingA Current Elo rating of Fighter A
 * @param ratingB Current Elo rating of Fighter B
 * @returns Expected score between 0.0 and 1.0
 */
export function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculates the new Elo rating for a fighter after a bout.
 * @param currentRating The fighter's current Elo rating
 * @param expectedScore The expected score calculated before the bout
 * @param actualScore The actual score (1 for win, 0.5 for draw, 0 for loss)
 * @param kFactor The K-factor determining the maximum rating change (default: 32)
 * @returns The new Elo rating (rounded to nearest integer)
 */
export function getNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number,
  kFactor: number = ELO_K_FACTOR
): number {
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

export interface PredictionResult {
  expectedWinnerIndex: 1 | 2 | null;
  winProbabilityFighter1: number;
  winProbabilityFighter2: number;
  eloDifference: number;
  confidenceScore: number; // 0 to 100
}

/**
 * Generates an AI prediction based on Elo ratings.
 * @param rating1 Fighter 1's Elo rating
 * @param rating2 Fighter 2's Elo rating
 * @returns PredictionResult containing probabilities and confidence
 */
export function generatePrediction(rating1: number, rating2: number): PredictionResult {
  const prob1 = getExpectedScore(rating1, rating2);
  const prob2 = 1 - prob1;
  const eloDiff = Math.abs(rating1 - rating2);
  
  // Confidence score: how far the probability is from 50/50, scaled to 0-100
  // e.g., 50% = 0 confidence, 90% = 80 confidence, 100% = 100 confidence
  const maxProb = Math.max(prob1, prob2);
  const confidenceScore = Math.round((maxProb - 0.5) * 200);

  let expectedWinnerIndex: 1 | 2 | null = null;
  if (prob1 > prob2) expectedWinnerIndex = 1;
  else if (prob2 > prob1) expectedWinnerIndex = 2;

  return {
    expectedWinnerIndex,
    winProbabilityFighter1: Number((prob1 * 100).toFixed(1)),
    winProbabilityFighter2: Number((prob2 * 100).toFixed(1)),
    eloDifference: eloDiff,
    confidenceScore
  };
}
