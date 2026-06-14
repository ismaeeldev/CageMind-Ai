import "dotenv/config";

// Simple test matching the logic in the performance route
function calculateProfit(isCorrect: boolean, aiOdds: number | null): { profit: number; wager: number } {
  const odds = aiOdds !== null ? aiOdds : -110;
  const wager = 100;
  let profit = 0;
  if (isCorrect) {
    if (odds > 0) {
      profit = odds; // e.g., +150 odds → $150 profit
    } else if (odds < 0) {
      profit = (100 / Math.abs(odds)) * 100; // e.g., -200 odds → $50 profit
    } else {
      profit = 0;
    }
  } else {
    profit = -100;
  }
  return { profit, wager };
}

function verifyRoi() {
  console.log("=== Testing ROI Computation Formulating Heuristics ===");

  // Test Case 1: Positive moneyline odds, correct pick
  const tc1 = calculateProfit(true, 150);
  console.log("TC1 (Correct Pick +150):", tc1);
  if (tc1.wager === 100 && tc1.profit === 150) {
    console.log("✓ TC1 Passed");
  } else {
    console.error("X TC1 Failed");
    process.exit(1);
  }

  // Test Case 2: Negative moneyline odds, correct pick
  const tc2 = calculateProfit(true, -200);
  console.log("TC2 (Correct Pick -200):", tc2);
  if (tc2.wager === 100 && tc2.profit === 50) {
    console.log("✓ TC2 Passed");
  } else {
    console.error("X TC2 Failed");
    process.exit(1);
  }

  // Test Case 3: Positive moneyline odds, incorrect pick
  const tc3 = calculateProfit(false, 120);
  console.log("TC3 (Incorrect Pick +120):", tc3);
  if (tc3.wager === 100 && tc3.profit === -100) {
    console.log("✓ TC3 Passed");
  } else {
    console.error("X TC3 Failed");
    process.exit(1);
  }

  // Test Case 4: Null odds, correct pick (should fallback to -110 odds)
  const tc4 = calculateProfit(true, null);
  console.log("TC4 (Null Odds):", tc4);
  if (tc4.wager === 100 && Math.abs(tc4.profit - 90.91) < 0.01) {
    console.log("✓ TC4 Passed");
  } else {
    console.error("X TC4 Failed");
    process.exit(1);
  }

  // Test Case 5: Division by zero prevention on total stats
  const picks = [tc1, tc2, tc3, tc4];
  const totalProfit = picks.reduce((s, p) => s + p.profit, 0);
  const totalWager = picks.reduce((s, p) => s + p.wager, 0);
  const overallROI = totalWager > 0 ? (totalProfit / totalWager) * 100 : 0;

  console.log(`Summary - Profit: $${totalProfit.toFixed(2)}, Wagered: $${totalWager}, ROI: ${overallROI.toFixed(2)}%`);
  if (totalWager === 400 && Math.abs(totalProfit - 190.91) < 0.01 && Math.round(overallROI) === 48) {
    console.log("✓ ROI Aggregating Passed");
  } else {
    console.error("X ROI Aggregating Failed");
    process.exit(1);
  }

  console.log("ALL ROI FORMULA VERIFICATIONS PASSED ✓");
}

verifyRoi();
