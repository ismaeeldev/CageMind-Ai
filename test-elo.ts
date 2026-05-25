import 'dotenv/config';
import { getExpectedScore, getNewRating, generatePrediction } from './src/lib/elo.ts';
import { prisma } from './src/lib/db.ts';
import { resolveFight, attachPredictionToFight } from './src/actions/rankings.ts';

async function testEloLogic() {
  let hasErrors = false;

  console.log("1. Testing Elo Unit Logic");
  const expectedEqual = getExpectedScore(1500, 1500);
  if (expectedEqual === 0.5) {
    console.log("✓ Expected score for equal ratings is 0.5");
  } else {
    console.error("X Expected score for equal ratings should be 0.5, got", expectedEqual);
    hasErrors = true;
  }

  const expectedHigher = getExpectedScore(1600, 1500);
  if (expectedHigher > 0.6) {
    console.log("✓ Expected score for higher rating is > 0.5");
  } else {
    console.error("X Expected score for higher rating is incorrect", expectedHigher);
    hasErrors = true;
  }

  const newWin = getNewRating(1500, 0.5, 1);
  if (newWin === 1516) {
    console.log("✓ New rating after win against equal opponent (+16)");
  } else {
    console.error("X New rating after win against equal opponent incorrect", newWin);
    hasErrors = true;
  }

  const newLoss = getNewRating(1500, 0.5, 0);
  if (newLoss === 1484) {
    console.log("✓ New rating after loss against equal opponent (-16)");
  } else {
    console.error("X New rating after loss against equal opponent incorrect", newLoss);
    hasErrors = true;
  }

  console.log("\n2. Testing Prediction Engine");
  const prediction = generatePrediction(1600, 1500);
  if (prediction.expectedWinnerIndex === 1 && prediction.confidenceScore > 0) {
    console.log("✓ Prediction correctly favors fighter 1 with positive confidence");
  } else {
    console.error("X Prediction logic failed", prediction);
    hasErrors = true;
  }

  console.log("\n3. Testing Database Integration");
  // We need a test fight. Let's find one where the winner is null (e.g. UFC 302 seeded earlier)
  const fight = await prisma.fight.findFirst({
    where: { winnerId: null },
    include: { fighter1: true, fighter2: true }
  });

  if (fight) {
    console.log(`Found unassigned fight: ${fight.fighter1.name} vs ${fight.fighter2.name}`);
    
    // Attach prediction
    const attachedPrediction = await attachPredictionToFight(fight.id);
    if (attachedPrediction.winProbabilityFighter1 || attachedPrediction.winProbabilityFighter2) {
      console.log("✓ Successfully generated and attached prediction to fight");
    } else {
      console.error("X Failed to attach prediction");
      hasErrors = true;
    }

    // Resolve fight (Fighter 1 wins)
    const originalElo1 = fight.fighter1.eloRating;
    const originalElo2 = fight.fighter2.eloRating;

    console.log(`Resolving fight. ${fight.fighter1.name} wins.`);
    const result = await resolveFight(fight.id, fight.fighter1.id, "KO", 2, "1:35");

    if (result.success && result.newRating1 > originalElo1 && result.newRating2 < originalElo2) {
      console.log("✓ Successfully updated DB with new Elo ratings");
    } else {
      console.error("X Failed to update Elo ratings in DB");
      hasErrors = true;
    }
  } else {
    console.log("! No unresolved fight found to test DB integration. Skipping DB test.");
  }

  console.log("\n--- Test Summary ---");
  if (hasErrors) {
    console.error("FAILED: Some tests did not pass.");
    process.exit(1);
  } else {
    console.log("ALL TESTS PASSED ✓");
  }
}

testEloLogic().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
