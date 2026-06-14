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
 * Seeds a fighter's initial Elo rating based on their win/loss record.
 * Used for fighters who have no individual fight records in the Fight table.
 * Returns 1300 for unproven fighters (0-0), scaling ±200 by win rate and experience.
 */
export function seedElo(fighter: { wins: number; losses: number; age: number | null }): number {
  const BASE = 1300;
  const total = fighter.wins + fighter.losses;
  if (total === 0) return BASE;

  const winRate = fighter.wins / total;
  // Ramp confidence over the first 15 fights so a 1-0 record barely moves the needle
  const expFactor = Math.min(1.0, total / 15);
  const adjustment = Math.round((winRate - 0.5) * 400 * expFactor);

  return Math.max(900, Math.min(1600, BASE + adjustment));
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
 * Determines whether an event is a UFC-sanctioned fight.
 * Handles all UFC naming conventions:
 *   - "UFC 300", "UFC Fight Night 248"
 *   - "Fight Night" (standalone)
 *   - "The Ultimate Fighter" / "TUF"
 *   - "Dana White's Contender Series"
 *   - "[Fighter] vs [Fighter]" style UFC cards (no "UFC" prefix)
 *   - Apex events
 *
 * Use this everywhere instead of a raw `.includes("ufc")` check.
 */
export function isUFCEvent(eventName: string | null | undefined): boolean {
  if (!eventName) return false;
  const n = eventName.toLowerCase().trim();
  return (
    n.includes("ufc") ||
    n.includes("fight night") ||
    n.includes("the ultimate fighter") ||
    n.startsWith("tuf ") ||
    n.includes("contender series") ||
    n.includes("apex") ||
    // "Fighter vs Fighter" cards that are UFC events but lack the "UFC" prefix
    // Detect by checking if it matches the "Name vs Name" / "Name vs. Name" pattern
    // AND does NOT contain non-UFC organisation keywords
    (/^[a-z].+ vs\.? [a-z].+$/.test(n) &&
      !n.includes("bellator") &&
      !n.includes("one fc") &&
      !n.includes("one championship") &&
      !n.includes("pfl") &&
      !n.includes("rizin") &&
      !n.includes("invicta") &&
      !n.includes("ksw") &&
      !n.includes("cage warriors"))
  );
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

  // Upset mechanics (Dynamically scaled based on pre-fight probability)
  if (winnerExp < 0.5) {
    // Greater upsets yield a larger ELO shift. Scale bonus up to +1.0 for huge upsets.
    const upsetBonus = (0.5 - winnerExp) * 2.0;
    mult += upsetBonus;
    
    // Extra bonus if the underdog finishes the fight
    if (finish) {
      mult += 0.30;
    }
  }

  // Narrow decision discount
  if (!finish && winnerExp > 0.44 && winnerExp < 0.58) mult -= 0.10;

  // Undefeated Bonus
  if (outcome.winnerIsUndefeated) mult += 0.15;

  mult = Math.max(0.6, mult);

  let dA = Math.round(K * mult * (Sa - Ea));

  // Promotion Weight (Only gain/lose ELO points in UFC fights)
  if (outcome.isUFCFight) {
    dA = Math.round(dA * 2.0);
  } else {
    // Non-UFC fights result in exactly 0 Elo change
    dA = 0;
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
