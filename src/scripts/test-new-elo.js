const { calculateEloDelta } = require("../src/lib/elo");

function test() {
  console.log("--- ELO ENGINE INTEGRITY TEST ---\n");

  // Case 1: Standard Win (Fighter 1 is favorite, wins)
  // Rating 1 = 1700, Rating 2 = 1500
  // Pre-fight win expectation for Fighter 1 = 0.76 (76%)
  const standardWinnerExp = 0.76;
  const standardF1 = 1700;
  const standardF2 = 1500;

  // Case 2: Major Upset Win (Fighter 1 is big underdog, wins)
  // Rating 1 = 1500, Rating 2 = 1800
  // Pre-fight win expectation for Fighter 1 = 0.15 (15%)
  const upsetWinnerExp = 0.15;
  const upsetF1 = 1500;
  const upsetF2 = 1800;

  // Let's compute delta for UFC vs non-UFC on standard wins
  const ufcStandardDelta = calculateEloDelta(standardF1, standardF2, {
    winnerId: "fighter1",
    fighter1Id: "fighter1",
    fighter2Id: "fighter2",
    isUFCFight: true,
    method: "Decision"
  });

  const nonUfcStandardDelta = calculateEloDelta(standardF1, standardF2, {
    winnerId: "fighter1",
    fighter1Id: "fighter1",
    fighter2Id: "fighter2",
    isUFCFight: false,
    method: "Decision"
  });

  console.log("1. UFC VS NON-UFC MULTIPLIER TEST (FAVORITE WINS)");
  console.log(`- UFC Fight ELO Change:    +${ufcStandardDelta} ELO`);
  console.log(`- Non-UFC Fight ELO Change: +${nonUfcStandardDelta} ELO`);
  console.log(`- UFC weight factor is exactly 2.0x of Non-UFC: ${ufcStandardDelta / nonUfcStandardDelta === 2 ? "PASSED ✓" : "FAILED"}\n`);

  // Let's compute delta for UFC vs non-UFC on major upsets
  const ufcUpsetDelta = calculateEloDelta(upsetF1, upsetF2, {
    winnerId: "fighter1",
    fighter1Id: "fighter1",
    fighter2Id: "fighter2",
    isUFCFight: true,
    method: "KO/TKO",
    round: 1
  });

  const nonUfcUpsetDelta = calculateEloDelta(upsetF1, upsetF2, {
    winnerId: "fighter1",
    fighter1Id: "fighter1",
    fighter2Id: "fighter2",
    isUFCFight: false,
    method: "KO/TKO",
    round: 1
  });

  console.log("2. UFC VS NON-UFC MULTIPLIER TEST (UNDERDOG UPSET WINS WITH FINISH)");
  console.log(`- UFC Upset ELO Change:    +${ufcUpsetDelta} ELO`);
  console.log(`- Non-UFC Upset ELO Change: +${nonUfcUpsetDelta} ELO`);
  console.log(`- UFC weight factor is exactly 2.0x of Non-UFC: ${ufcUpsetDelta / nonUfcUpsetDelta === 2 ? "PASSED ✓" : "FAILED"}\n`);

  console.log("3. UPSET SCALING SENSITIVITY TEST (UFC WINS)");
  // Standard win ELO change
  console.log(`- Favorite Win (76% Win Expectation): +${ufcStandardDelta} ELO`);
  // Upset win ELO change
  console.log(`- Underdog Upset (15% Win Expectation): +${ufcUpsetDelta} ELO`);
  console.log(`- Underdog receives heavier ELO shift: ${ufcUpsetDelta > ufcStandardDelta ? "PASSED ✓" : "FAILED"}`);
}

test();
