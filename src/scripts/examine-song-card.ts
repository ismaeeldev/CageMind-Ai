import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  const event = await prisma.event.findFirst({
    where: {
      name: { contains: "Song vs Figueiredo", mode: "insensitive" }
    },
    include: {
      fights: {
        include: {
          fighter1: true,
          fighter2: true,
          winner: true
        }
      }
    }
  });

  if (!event) {
    console.log("Song vs Figueiredo event not found in database.");
    return;
  }

  console.log(`Event ID: ${event.id}`);
  console.log(`Event Name: ${event.name}`);
  console.log(`Event Date: ${event.date}`);
  console.log(`isUpcoming: ${event.isUpcoming}`);
  console.log(`isProcessed: ${event.isProcessed}`);
  console.log(`Number of fights: ${event.fights.length}`);

  for (const fight of event.fights) {
    console.log(`- Fight: ${fight.fighter1.name} vs ${fight.fighter2.name} | Weight: ${fight.weightClass} | Winner: ${fight.winner?.name || "None"} | Prediction: ${fight.aiPrediction || "None"}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
