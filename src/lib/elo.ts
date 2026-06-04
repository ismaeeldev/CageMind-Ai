export const ELO_K_FACTOR = 30;
export const ELO_K_FACTOR_TITLE = 42;

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
 * Calculates a fighter's new Elo rating after a bout.
 * @param currentRating Fighter's current Elo rating
 * @param expectedScore Expected score (from getExpectedScore)
 * @param actualScore Actual score: 1 = win, 0 = loss, 0.5 = draw
 * @param kFactor Optional K-factor override (default: ELO_K_FACTOR)
 * @returns New Elo rating (rounded to nearest integer)
 */
export function getNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number,
  kFactor: number = ELO_K_FACTOR
): number {
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

/**
 * Seeds a fighter's initial Elo rating based on their record and age.
 */
export function seedElo(fighter: { wins: number; losses: number; age: number | null }): number {
  let e = 1450;
  const ww = fighter.wins || 0;
  const ll = fighter.losses || 0;

  // Career win rate impact
  e += (ww / ((ww + ll) || 1) - 0.5) * 300;

  // Experience/volume impact
  e += Math.min(ww, 28) * 4.5;

  // Age curve impact
  if (fighter.age) {
    if (fighter.age >= 27 && fighter.age <= 32) e += 14;        // athletic prime
    else if (fighter.age > 35) e -= (fighter.age - 35) * 7;
    else if (fighter.age < 24) e -= (24 - fighter.age) * 5;
  }

  return Math.round(e);
}

export interface FightOutcomeDetails {
  isTitleFight?: boolean;
  method?: string | null; // e.g., 'KO/TKO', 'Submission', 'Decision'
  round?: number | null;
  winnerId: string;
  fighter1Id: string;
  fighter2Id: string;
  isUFCFight?: boolean;
  winnerIsUndefeated?: boolean;
}

/**
 * Calculates the Elo delta (dA) for Fighter 1 given the bout outcome.
 * Fighter 2's delta is simply -dA.
 */
export function calculateEloDelta(
  rating1: number,
  rating2: number,
  outcome: FightOutcomeDetails
): number {
  if (!outcome.winnerId) return 0; // Draw or no contest

  const Ea = getExpectedScore(rating1, rating2);
  const Sa = outcome.winnerId === outcome.fighter1Id ? 1 : 0;

  // Identify the winner's expected probability
  const winnerExp = Sa === 1 ? Ea : 1 - Ea;

  const finish = outcome.method === 'KO/TKO' || outcome.method === 'Submission';
  let K = outcome.isTitleFight ? ELO_K_FACTOR_TITLE : ELO_K_FACTOR;
  let mult = 1;

  if (outcome.method === 'KO/TKO') mult += 0.30;
  else if (outcome.method === 'Submission') mult += 0.34;
  else mult -= 0.12; // decision

  if (finish && outcome.round === 1) mult += 0.30;
  else if (finish && outcome.round === 2) mult += 0.14;

  if (finish && outcome.isTitleFight) mult += 0.22;

  // Upset mechanics (Now factored more heavily)
  if (winnerExp < 0.42) mult += 0.25; // Base upset bonus
  if (winnerExp < 0.30) mult += 0.35; // Major upset bonus
  if (winnerExp < 0.42 && finish) mult += 0.25; // Finish in an upset

  // Narrow decision discount
  if (!finish && winnerExp > 0.44 && winnerExp < 0.58) mult -= 0.10;

  // Undefeated Bonus
  if (outcome.winnerIsUndefeated) mult += 0.15;

  mult = Math.max(0.6, mult);

  let dA = Math.round(K * mult * (Sa - Ea));

  // Promotion Weight (Favor UFC fights)
  if (outcome.isUFCFight) {
    dA = Math.round(dA * 1.5);
  } else {
    // Non-UFC fights have less impact
    dA = Math.round(dA * 0.7);
  }

  return dA;
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
 */
export function generatePrediction(rating1: number, rating2: number): PredictionResult {
  const prob1 = getExpectedScore(rating1, rating2);
  const prob2 = 1 - prob1;
  const eloDiff = Math.abs(rating1 - rating2);

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
