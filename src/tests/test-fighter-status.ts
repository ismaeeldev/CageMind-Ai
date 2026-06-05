import 'dotenv/config';
import { prisma } from '../lib/db';
import { syncFighterStatus } from '../scripts/sync-fighter-status';

async function testFighterStatusLogic() {
  console.log("=== Testing Fighter Status Synchronization ===");
  
  // 1. Create a mock fighter
  const fighterName = "Test Khabib Nurmagomedov Mock";
  
  console.log("Creating mock fighter...");
  let fighter = await prisma.fighter.findFirst({
    where: { name: fighterName }
  });

  if (fighter) {
    await prisma.fight.deleteMany({
      where: {
        OR: [
          { fighter1Id: fighter.id },
          { fighter2Id: fighter.id }
        ]
      }
    });
    await prisma.fighter.delete({ where: { id: fighter.id } });
  }

  fighter = await prisma.fighter.create({
    data: {
      name: fighterName,
      isActive: true,
      eloRating: 1500,
      weightClass: "Lightweight"
    }
  });

  console.log(`✓ Mock fighter created: ${fighter.name} (ID: ${fighter.id})`);

  // 2. Create a mock event from 3 years ago
  const oldDate = new Date();
  oldDate.setFullYear(oldDate.getFullYear() - 3);

  const event = await prisma.event.create({
    data: {
      name: "UFC Mock Legacy Event",
      date: oldDate,
      isUpcoming: false,
      isProcessed: true,
      location: "Las Vegas, NV"
    }
  });
  console.log(`✓ Mock event from 3 years ago created: ${event.name} on ${event.date.toLocaleDateString()}`);

  // Create an opponent
  const opponent = await prisma.fighter.create({
    data: {
      name: "Mock Opponent Fighter",
      isActive: true,
      eloRating: 1400,
      weightClass: "Lightweight"
    }
  });

  // Create completed fight
  const fight = await prisma.fight.create({
    data: {
      eventId: event.id,
      fighter1Id: fighter.id,
      fighter2Id: opponent.id,
      winnerId: fighter.id,
      method: "Submission",
      endingRound: 2,
      endingTime: "2:05",
      isTitleFight: true
    }
  });
  console.log(`✓ Mock fight created: ${fighter.name} vs ${opponent.name}`);

  // 3. Run syncFighterStatus
  console.log("Running syncFighterStatus()...");
  await syncFighterStatus();

  // 4. Verify mock fighter status
  const updatedFighter = await prisma.fighter.findUnique({
    where: { id: fighter.id }
  });

  console.log("\n--- Verification ---");
  let passed = false;
  if (updatedFighter && updatedFighter.isActive === false) {
    console.log("✓ Success: Fighter status correctly synced to inactive/retired.");
    passed = true;
  } else {
    console.error("X Failure: Fighter status was not updated to inactive/retired.");
  }

  // 5. Cleanup
  console.log("\nCleaning up test database records...");
  await prisma.fight.delete({ where: { id: fight.id } });
  await prisma.event.delete({ where: { id: event.id } });
  await prisma.fighter.delete({ where: { id: fighter.id } });
  await prisma.fighter.delete({ where: { id: opponent.id } });
  console.log("✓ Cleanup finished.");

  if (!passed) {
    process.exit(1);
  }
}

testFighterStatusLogic()
  .catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
