import { EdgeCalculator } from "./src/lib/edge-calculator";

console.log("=== Edge Calculator Test ===");

const testCases = [
  { aiProb: 0.65, odds: +120, description: "AI heavily favors underdog" },
  { aiProb: 0.55, odds: -110, description: "Standard pick em, slight AI edge" },
  { aiProb: 0.20, odds: -300, description: "AI hates heavy favorite" },
  { aiProb: 0.40, odds: +200, description: "Value dog play" }
];

for (const t of testCases) {
  const result = EdgeCalculator.calculateEdge(t.aiProb, t.odds);
  console.log(`\nScenario: ${t.description}`);
  console.log(`Inputs: AI Probability = ${(t.aiProb * 100).toFixed(1)}%, Sportsbook Odds = ${t.odds}`);
  console.log(`- Implied Probability: ${result.impliedProbability}%`);
  console.log(`- Edge Percentage: ${result.edgePercentage}%`);
  console.log(`- Expected Value ($100 bet): $${result.expectedValue}`);
  
  if (result.isPositiveEV) {
    console.log(`⭐ POSITIVE EV OPPORTUNITY FOUND!`);
  } else {
    console.log(`🚫 NEGATIVE EV - DO NOT BET.`);
  }
}

console.log("\n============================");
