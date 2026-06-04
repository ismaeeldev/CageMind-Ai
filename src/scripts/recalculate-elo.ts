import "dotenv/config";
import { prisma } from "../lib/db";
import { seedElo, calculateEloDelta } from "../lib/elo";

export async function recalculateAllElo() {
  console.log("Starting Elo recalculation...");

  const fighters = await prisma.fighter.findMany();
  console.log(`Fetched ${fighters.length} fighters.`);

  const eloMap = new Map<string, number>();

  for (const fighter of fighters) {
    const seededElo = seedElo({
      wins: fighter.wins,
      losses: fighter.losses,
      age: fighter.age,
    });
    eloMap.set(fighter.id, seededElo);
  }

  const fights = await prisma.fight.findMany({
    where: {
      winnerId: { not: null },
      event: { isUpcoming: false }
    },
    orderBy: {
      event: { date: 'asc' }
    },
    include: {
      event: true,
      fighter1: true,
      fighter2: true
    }
  });

  console.log(`Fetched ${fights.length} completed fights. Processing Elo chronologically...`);

  for (const fight of fights) {
    if (!fight.winnerId) continue;

    const currentElo1 = eloMap.get(fight.fighter1Id) || 1500;
    const currentElo2 = eloMap.get(fight.fighter2Id) || 1500;

    const isUFCFight = fight.event?.name?.toLowerCase().includes("ufc") ?? false;
    const winnerLosses = fight.winnerId === fight.fighter1Id ? fight.fighter1.losses : fight.fighter2.losses;

    const dA = calculateEloDelta(currentElo1, currentElo2, {
      isTitleFight: fight.isTitleFight,
      method: fight.method,
      round: fight.endingRound,
      winnerId: fight.winnerId,
      fighter1Id: fight.fighter1Id,
      fighter2Id: fight.fighter2Id,
      isUFCFight,
      winnerIsUndefeated: winnerLosses === 0
    });

    eloMap.set(fight.fighter1Id, currentElo1 + dA);
    eloMap.set(fight.fighter2Id, currentElo2 - dA);
  }

  console.log("Elo calculation complete. Saving to database...");

  let updatedCount = 0;
  const chunkSize = 25; // Smaller chunks and no transaction to avoid timeout with serverless db
  const fighterIds = Array.from(eloMap.keys());
  
  for (let i = 0; i < fighterIds.length; i += chunkSize) {
    const chunk = fighterIds.slice(i, i + chunkSize);
    
    await Promise.all(
      chunk.map(id => 
        prisma.fighter.update({
          where: { id },
          data: { eloRating: eloMap.get(id) }
        })
      )
    );
    
    updatedCount += chunk.length;
    console.log(`Saved ${updatedCount} / ${fighterIds.length} fighters...`);
  }

  console.log("Successfully recalculated and saved all Elo ratings.");
}

// If run directly from CLI
if (require.main === module) {
  recalculateAllElo()
    .catch(e => {
      console.error("Error recalculating Elo:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
