/**
 * Deduplicate fighter records in the database.
 *
 * Finds fighters with identical names (case-insensitive, trimmed), picks one
 * canonical record per group, migrates all Fight references
 * (fighter1Id, fighter2Id, winnerId) onto the canonical ID, then deletes the
 * orphaned duplicates.
 *
 * Canonical selection priority (highest wins):
 *   1. Has a real imageUrl (photo = properly scraped UFC profile)
 *   2. Has a ufcId
 *   3. Most total fight rows in DB
 *   4. Highest wins + losses (most complete career record)
 *   5. Highest eloRating
 *
 * If reassigning a fight would violate the @@unique([eventId,fighter1Id,fighter2Id])
 * constraint (i.e. the canonical already has that bout), the duplicate fight row
 * is deleted instead — it refers to the same real-world fight.
 *
 * Usage:
 *   npm run fighters:dedup-dry   # preview — no writes
 *   npm run fighters:dedup       # apply merges and deletions
 *
 * After --execute always run:
 *   npm run elo:recalculate
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

// ─── DB helpers ───────────────────────────────────────────────────────────────

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

function freshClient() {
  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 60_000,
    idleTimeoutMillis: 30_000,
    max: 5,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const cleanup = async () => {
    try { await prisma.$disconnect(); } catch {}
    try { await pool.end(); } catch {}
  };
  return { prisma, cleanup };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Deduplicate Fighters (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const { prisma, cleanup } = freshClient();

  try {
    const fighters = await prisma.fighter.findMany({
      include: {
        _count: {
          select: {
            fightsAsFighter1: true,
            fightsAsFighter2: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log(`Loaded ${fighters.length} fighter records.\n`);

    // Group by normalised name
    const byName = new Map<string, typeof fighters>();
    for (const f of fighters) {
      const key = f.name.trim().toLowerCase();
      const group = byName.get(key) ?? [];
      group.push(f);
      byName.set(key, group);
    }

    const duplicateGroups = [...byName.values()].filter(g => g.length > 1);

    if (duplicateGroups.length === 0) {
      console.log("No duplicate fighters found. Database is clean.");
      return;
    }

    console.log(`Found ${duplicateGroups.length} duplicate group(s):\n`);

    let deletedFighters = 0;
    let deletedFights = 0;
    let reassignedFights = 0;

    for (const group of duplicateGroups) {
      // Sort: prefer imageUrl → ufcId → most DB fights → most career wins → highest ELO
      const hasRealImage = (f: typeof group[0]) => {
        const img = f.imageUrl?.trim();
        return !!(img && img !== "null" && img !== "undefined" && img !== "N/A");
      };
      const sorted = [...group].sort((a, b) => {
        // 1. Has a real photo (primary signal of an authoritative UFC profile)
        const aImg = hasRealImage(a) ? 1 : 0;
        const bImg = hasRealImage(b) ? 1 : 0;
        if (bImg !== aImg) return bImg - aImg;

        // 2. Has a ufcId
        const aUfc = a.ufcId ? 1 : 0;
        const bUfc = b.ufcId ? 1 : 0;
        if (bUfc !== aUfc) return bUfc - aUfc;

        // 3. Most fight rows linked in DB
        const aFights = a._count.fightsAsFighter1 + a._count.fightsAsFighter2;
        const bFights = b._count.fightsAsFighter1 + b._count.fightsAsFighter2;
        if (bFights !== aFights) return bFights - aFights;

        // 4. Most complete career record
        const aCareer = a.wins + a.losses + a.draws;
        const bCareer = b.wins + b.losses + b.draws;
        if (bCareer !== aCareer) return bCareer - aCareer;

        // 5. Highest ELO
        return b.eloRating - a.eloRating;
      });

      const canonical = sorted[0];
      const duplicates = sorted.slice(1);

      const canonFights =
        canonical._count.fightsAsFighter1 + canonical._count.fightsAsFighter2;

      console.log(
        `  KEEP:   "${canonical.name}"  id=${canonical.id}  ` +
        `elo=${canonical.eloRating}  fights=${canonFights}` +
        (canonical.ufcId ? `  ufcId=${canonical.ufcId}` : "")
      );

      for (const dup of duplicates) {
        const dupFights = dup._count.fightsAsFighter1 + dup._count.fightsAsFighter2;
        console.log(
          `  REMOVE: "${dup.name}"  id=${dup.id}  ` +
          `elo=${dup.eloRating}  fights=${dupFights}` +
          (dup.ufcId ? `  ufcId=${dup.ufcId}` : "")
        );
      }

      if (!DRY_RUN) {
        for (const dup of duplicates) {
          // Carry ufcId to canonical if it lacks one
          if (!canonical.ufcId && dup.ufcId) {
            await prisma.fighter.update({
              where: { id: canonical.id },
              data: { ufcId: dup.ufcId },
            });
            // Update local object so subsequent dups don't overwrite
            (canonical as any).ufcId = dup.ufcId;
          }

          // Find every fight that references the duplicate
          const dupFightRows = await prisma.fight.findMany({
            where: {
              OR: [
                { fighter1Id: dup.id },
                { fighter2Id: dup.id },
                { winnerId: dup.id },
              ],
            },
            select: {
              id: true,
              eventId: true,
              fighter1Id: true,
              fighter2Id: true,
              winnerId: true,
            },
          });

          for (const fight of dupFightRows) {
            const newF1 = fight.fighter1Id === dup.id ? canonical.id : fight.fighter1Id;
            const newF2 = fight.fighter2Id === dup.id ? canonical.id : fight.fighter2Id;
            const newWinner = fight.winnerId === dup.id ? canonical.id : fight.winnerId;

            // Check for unique constraint collision on the Fight table
            if (fight.fighter1Id === dup.id || fight.fighter2Id === dup.id) {
              const collision = await prisma.fight.findFirst({
                where: {
                  id: { not: fight.id },
                  eventId: fight.eventId,
                  fighter1Id: newF1,
                  fighter2Id: newF2,
                },
              });

              if (collision) {
                // Same real bout already recorded on canonical — drop this duplicate row
                await prisma.predictionHistory.deleteMany({
                  where: { fightId: fight.id },
                });
                await prisma.fight.delete({ where: { id: fight.id } });
                deletedFights++;
                console.log(`    Collision fight dropped: ${fight.id}`);
                continue;
              }
            }

            await prisma.fight.update({
              where: { id: fight.id },
              data: { fighter1Id: newF1, fighter2Id: newF2, winnerId: newWinner },
            });
            reassignedFights++;
          }

          // Safe to delete — no more foreign key references
          await prisma.fighter.delete({ where: { id: dup.id } });
          deletedFighters++;
          console.log(`    Deleted duplicate fighter: ${dup.id}`);
        }
      }

      console.log();
    }

    if (DRY_RUN) {
      console.log("Dry-run complete — no changes written.");
      console.log("Run `npm run fighters:dedup` to apply.");
    } else {
      console.log("Deduplication complete.");
      console.log(`  Duplicate fighters deleted : ${deletedFighters}`);
      console.log(`  Fight rows reassigned      : ${reassignedFights}`);
      console.log(`  Duplicate fight rows dropped (collisions): ${deletedFights}`);
      console.log("\nNext step: run `npm run elo:recalculate` to rebuild ELO from clean data.");
    }
  } finally {
    await cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
