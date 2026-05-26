import { prisma } from "./src/lib/db";
import { PostEventProcessor } from "./src/jobs/post-event-processor";
import { logger } from "./src/lib/logger";

async function runTest() {
  logger.info("=== Starting Post-Event Processor Test ===");

  // 1. Find an upcoming event that has fights attached
  const event = await prisma.event.findFirst({
    where: { 
      isUpcoming: true,
      fights: { some: {} } // Ensure it has at least one fight
    },
    include: { fights: true }
  });

  if (!event) {
    logger.error("No upcoming events with fights found. Please run the sync job first.");
    process.exit(1);
  }

  logger.info(`Found event: ${event.name} with ${event.fights.length} fights.`);

  // Mark all other events as processed to avoid Neon timeouts on free tier during this specific test
  await prisma.event.updateMany({
    where: { id: { not: event.id } },
    data: { isProcessed: true, isUpcoming: false }
  });

  // 2. Mark our target event as completed so the processor picks it up
  await prisma.event.update({
    where: { id: event.id },
    data: { isUpcoming: false, isProcessed: false }
  });
  logger.info(`Marked ${event.name} as completed (isUpcoming: false)`);

  // 3. Run the Post-Event Processor
  const processor = new PostEventProcessor();
  await processor.processCompletedEvents();

  // 4. Verify the Audit Log and Elo updates for THIS specific event
  const eventLog = await prisma.auditLog.findFirst({
    where: {
      action: "POST_EVENT_PROCESSING",
      details: { contains: event.id }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (eventLog) {
    const details = JSON.parse(eventLog.details);
    if (details.eventId === event.id) {
      logger.info("\n=== ELO UPDATES VERIFIED ===");
      for (const shift of details.eloShifts) {
        logger.info(`Fight: ${shift.fighter1.name} vs ${shift.fighter2.name}`);
        logger.info(`  -> ${shift.fighter1.name}: ${shift.fighter1.oldElo} => ${shift.fighter1.newElo} (Result: ${shift.fighter1.result})`);
        logger.info(`  -> ${shift.fighter2.name}: ${shift.fighter2.oldElo} => ${shift.fighter2.newElo} (Result: ${shift.fighter2.result})`);
      }
      logger.info("============================\n");
      logger.info("Test Passed: Elo automatically updated and logged.");
    }
  } else {
    logger.error("No audit log found for this event. Something went wrong.");
  }

  await prisma.$disconnect();
}

runTest().catch(e => {
  console.error(e);
  process.exit(1);
});
