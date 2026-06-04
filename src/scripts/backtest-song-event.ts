import "dotenv/config";
import { prisma } from "../lib/db";
import { PostEventProcessor } from "../jobs/post-event-processor";
import { recalculateAllElo } from "./recalculate-elo";

async function main() {
  console.log("Locating Song vs Figueiredo event...");
  const event = await prisma.event.findFirst({
    where: {
      name: { contains: "Song vs Figueiredo", mode: "insensitive" }
    }
  });

  if (!event) {
    console.error("Song vs Figueiredo event not found in database!");
    process.exit(1);
  }

  console.log(`Found event: ${event.name} (ID: ${event.id})`);

  // Reset event states to trigger the processor
  console.log("Resetting event to completed but unprocessed state...");
  await prisma.event.update({
    where: { id: event.id },
    data: {
      isUpcoming: false,
      isProcessed: false
    }
  });

  // Clear any existing predictions/results on this event's fights for a clean back-test run
  console.log("Clearing existing fight predictions/results for a clean slate...");
  const fights = await prisma.fight.findMany({
    where: { eventId: event.id }
  });

  for (const fight of fights) {
    await prisma.predictionHistory.deleteMany({
      where: { fightId: fight.id }
    });
    
    await prisma.fight.update({
      where: { id: fight.id },
      data: {
        winnerId: null,
        method: null,
        endingRound: null,
        endingTime: null,
        aiPrediction: null,
        aiConfidence: null
      }
    });
  }

  console.log("Fights cleared. Instantiating PostEventProcessor...");
  const processor = new PostEventProcessor();
  await processor.processCompletedEvents();

  console.log("Recalculating all ELOs chronologically to ensure absolute consistency...");
  await recalculateAllElo();

  console.log("Backtesting complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
