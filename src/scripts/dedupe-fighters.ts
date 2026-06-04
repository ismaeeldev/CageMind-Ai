import "dotenv/config";
import { prisma } from "../lib/db";

function normalizeName(name: string) {
  // Lowercase, remove accents, remove non-alphanumeric except spaces, trim multiple spaces
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Hardcoded known misspelled aliases mapped to canonical normalized names
const ALIASES: Record<string, string> = {
  "belal muhamed": "belal muhammad",
  "eduardo matias torres": "manuel torres", // from user feedback #5
  "alex pereria": "alex pereira",
  "illia topuria": "ilia topuria"
};

async function dedupeFighters() {
  console.log("Starting Fighter Deduplication Sweep...");

  const allFighters = await prisma.fighter.findMany({
    include: {
      fightsAsFighter1: true,
      fightsAsFighter2: true,
    }
  });

  console.log(`Fetched ${allFighters.length} fighters.`);

  // Group by normalized name
  const groups = new Map<string, typeof allFighters>();

  for (const f of allFighters) {
    let norm = normalizeName(f.name);
    // Apply aliases if known
    if (ALIASES[norm]) {
      norm = ALIASES[norm];
    }

    if (!groups.has(norm)) {
      groups.set(norm, []);
    }
    groups.get(norm)!.push(f);
  }

  let mergedCount = 0;
  let deletedCount = 0;

  for (const [normName, group] of groups.entries()) {
    if (group.length <= 1) continue;

    console.log(`\nFound duplicates for "${normName}": ${group.map(g => g.name).join(", ")}`);

    // Determine canonical fighter:
    // Criteria: 
    // 1. Has an image? (Prioritize)
    // 2. Most total fights in DB
    // 3. Highest Elo
    const sorted = group.sort((a, b) => {
      const aHasImg = a.imageUrl && a.imageUrl !== "N/A" && a.imageUrl !== "null" ? 1 : 0;
      const bHasImg = b.imageUrl && b.imageUrl !== "N/A" && b.imageUrl !== "null" ? 1 : 0;
      if (aHasImg !== bHasImg) return bHasImg - aHasImg;

      const aFights = a.fightsAsFighter1.length + a.fightsAsFighter2.length;
      const bFights = b.fightsAsFighter1.length + b.fightsAsFighter2.length;
      if (aFights !== bFights) return bFights - aFights;

      return b.eloRating - a.eloRating;
    });

    const canonical = sorted[0];
    const duplicates = sorted.slice(1);

    console.log(`   Selected Canonical: ${canonical.name} (ID: ${canonical.id}, Fights: ${canonical.fightsAsFighter1.length + canonical.fightsAsFighter2.length}, Elo: ${canonical.eloRating})`);

    for (const dup of duplicates) {
      console.log(`   Processing duplicate: ${dup.name} (ID: ${dup.id})`);

      // 1. Move fightsAsFighter1
      for (const fight of dup.fightsAsFighter1) {
        try {
          console.log(`      Migrating Fight ${fight.id} (Fighter 1) to canonical.`);
          await prisma.fight.update({
            where: { id: fight.id },
            data: { fighter1Id: canonical.id }
          });
        } catch (e: any) {
          if (e.code === 'P2002') {
            console.log(`      Duplicate fight found. Deleting duplicate Fight ${fight.id}`);
            await prisma.fight.delete({ where: { id: fight.id } });
          } else {
            throw e;
          }
        }
      }

      // 2. Move fightsAsFighter2
      for (const fight of dup.fightsAsFighter2) {
        try {
          console.log(`      Migrating Fight ${fight.id} (Fighter 2) to canonical.`);
          await prisma.fight.update({
            where: { id: fight.id },
            data: { fighter2Id: canonical.id }
          });
        } catch (e: any) {
          if (e.code === 'P2002') {
            console.log(`      Duplicate fight found. Deleting duplicate Fight ${fight.id}`);
            await prisma.fight.delete({ where: { id: fight.id } });
          } else {
            throw e;
          }
        }
      }

      // 3. Update any winnerId references
      const fightsWon = await prisma.fight.findMany({ where: { winnerId: dup.id } });
      for (const f of fightsWon) {
        await prisma.fight.update({
          where: { id: f.id },
          data: { winnerId: canonical.id }
        });
      }

      // 4. Delete the duplicate fighter
      console.log(`      Deleting duplicate fighter record: ${dup.id}`);
      await prisma.fighter.delete({ where: { id: dup.id } });
      deletedCount++;
    }
    mergedCount++;
  }

  console.log(`\nSweep Complete!`);
  console.log(`Merged ${mergedCount} fighter groups.`);
  console.log(`Deleted ${deletedCount} duplicate fighter records.`);
}

if (require.main === module) {
  dedupeFighters()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}
