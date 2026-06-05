import 'dotenv/config';
import { seedElo, calculateEloDelta } from '../lib/elo';

function testEloUfcLogic() {
  console.log("=== Testing ELO UFC Engine Modifications ===");

  // 1. Check seed Elo baseline
  const seeded = seedElo({ wins: 10, losses: 2, age: 30 });
  if (seeded === 1300) {
    console.log("✓ Success: Seeding returns exactly 1300 ELO baseline.");
  } else {
    console.error("X Failure: Seeding rating was expected to be 1300, got:", seeded);
    process.exit(1);
  }

  // 2. Check ELO shift for non-UFC fights
  const nonUfcDelta = calculateEloDelta(1300, 1300, {
    winnerId: "fighter-1",
    fighter1Id: "fighter-1",
    fighter2Id: "fighter-2",
    isTitleFight: false,
    isUFCFight: false,
    method: "KO/TKO",
    round: 1
  });

  if (nonUfcDelta === 0) {
    console.log("✓ Success: Non-UFC fights return exactly 0 ELO delta.");
  } else {
    console.error("X Failure: Non-UFC delta should be 0, got:", nonUfcDelta);
    process.exit(1);
  }

  // 3. Check ELO shift for UFC fights
  const ufcDelta = calculateEloDelta(1300, 1300, {
    winnerId: "fighter-1",
    fighter1Id: "fighter-1",
    fighter2Id: "fighter-2",
    isTitleFight: false,
    isUFCFight: true,
    method: "KO/TKO",
    round: 1
  });

  if (ufcDelta > 0) {
    console.log(`✓ Success: UFC fights return positive ELO delta (+${ufcDelta}) with quick finish multiplier.`);
  } else {
    console.error("X Failure: UFC delta should be positive, got:", ufcDelta);
    process.exit(1);
  }

  console.log("ALL ELO ENGINE TESTS PASSED ✓");
}

testEloUfcLogic();
