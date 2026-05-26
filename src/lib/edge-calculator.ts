export interface EdgeCalculationResult {
  impliedProbability: number;
  expectedValue: number; // EV based on a standard $100 wager
  edgePercentage: number;
  isPositiveEV: boolean;
}

export class EdgeCalculator {
  /**
   * Calculates the implied probability from American odds.
   * Positive Odds: 100 / (Odds + 100)
   * Negative Odds: |Odds| / (|Odds| + 100)
   */
  public static calculateImpliedProbability(americanOdds: number): number {
    if (americanOdds === 0) return 0;
    
    if (americanOdds > 0) {
      return 100 / (americanOdds + 100);
    } else {
      const absOdds = Math.abs(americanOdds);
      return absOdds / (absOdds + 100);
    }
  }

  /**
   * Calculates potential profit for a given wager based on American odds.
   */
  public static calculateProfit(americanOdds: number, wager: number = 100): number {
    if (americanOdds > 0) {
      return wager * (americanOdds / 100);
    } else {
      return wager * (100 / Math.abs(americanOdds));
    }
  }

  /**
   * Calculates Expected Value, Edge, and Implied Probability.
   * @param aiProbability The true probability according to our AI Engine (0.0 to 1.0)
   * @param americanOdds The sportsbook odds (e.g. -150 or +200)
   * @param wager The assumed wager amount (default $100)
   */
  public static calculateEdge(aiProbability: number, americanOdds: number, wager: number = 100): EdgeCalculationResult {
    // 1. Implied Probability
    const impliedProb = this.calculateImpliedProbability(americanOdds);

    // 2. Potential Profit
    const potentialProfit = this.calculateProfit(americanOdds, wager);

    // 3. Expected Value (EV)
    // EV = (Probability of Winning * Potential Profit) - (Probability of Losing * Wager)
    const winProb = Math.max(0, Math.min(1, aiProbability)); // Ensure bounded 0-1
    const lossProb = 1 - winProb;
    const ev = (winProb * potentialProfit) - (lossProb * wager);

    // 4. Edge Percentage
    // Edge = (EV / Wager) * 100
    const edge = (ev / wager) * 100;

    return {
      impliedProbability: Number((impliedProb * 100).toFixed(2)),
      expectedValue: Number(ev.toFixed(2)),
      edgePercentage: Number(edge.toFixed(2)),
      isPositiveEV: ev > 0
    };
  }
}
