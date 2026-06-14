import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedElo, calculateEloDelta, isUFCEvent } from "../lib/elo";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

/** Create a fresh pool + prisma client. Call cleanup() when done. */
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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function recalculateAllElo() {
  console.log("Starting Elo recalculation...");

  // ── Step 1: Read all fighters ──────────────────────────────────────────────
  const { prisma: readPrisma, cleanup: cleanupRead } = freshClient();
  let fighters: any[] = [];
  let fights: any[] = [];

  try {
    fighters = await readPrisma.fighter.findMany();
    console.log(`Fetched ${fighters.length} fighters.`);

    const now = new Date();
    fights = await readPrisma.fight.findMany({
      where: {
        winnerId: { not: null },
        event: {
          OR: [
            { isUpcoming: false },
            { date: { lt: now } },
          ],
        },
      },
      orderBy: { event: { date: "asc" } },
      include: { event: true, fighter1: true, fighter2: true },
    });
    console.log(`Fetched ${fights.length} completed fights with recorded winners. Processing Elo chronologically...`);
  } finally {
    await cleanupRead();
  }

  // ── Step 2: Calculate Elo in memory ───────────────────────────────────────
  const eloMap = new Map<string, number>();

  // Seed everyone at the base 1300 so fight-by-fight deltas start from a level field
  for (const fighter of fighters) {
    eloMap.set(fighter.id, 1300);
  }

  let ufcFightCount = 0;
  let nonUfcFightCount = 0;
  const fightParticipants = new Set<string>();

  for (const fight of fights) {
    if (!fight.winnerId) continue;

    fightParticipants.add(fight.fighter1Id);
    fightParticipants.add(fight.fighter2Id);

    const elo1 = eloMap.get(fight.fighter1Id) ?? 1300;
    const elo2 = eloMap.get(fight.fighter2Id) ?? 1300;
    const isUFCFight = isUFCEvent(fight.event?.name);

    if (isUFCFight) ufcFightCount++; else nonUfcFightCount++;

    const winnerLosses =
      fight.winnerId === fight.fighter1Id ? fight.fighter1.losses : fight.fighter2.losses;

    const delta = calculateEloDelta(elo1, elo2, {
      isTitleFight: fight.isTitleFight,
      method: fight.method,
      round: fight.endingRound,
      winnerId: fight.winnerId,
      fighter1Id: fight.fighter1Id,
      fighter2Id: fight.fighter2Id,
      isUFCFight,
      winnerIsUndefeated: winnerLosses === 0,
    });

    eloMap.set(fight.fighter1Id, elo1 + delta);
    eloMap.set(fight.fighter2Id, elo2 - delta);
  }

  console.log(`UFC fights: ${ufcFightCount} | Non-UFC fights (0 delta): ${nonUfcFightCount}`);

  // Fighters with no Fight-table records get seeded from their career wins/losses.
  // This covers the large set of fighters whose records exist only in the Fighter
  // row (from the fighter scraper) with no corresponding rows in the Fight table.
  let seededFromRecord = 0;
  for (const fighter of fighters) {
    if (!fightParticipants.has(fighter.id)) {
      const seeded = seedElo({ wins: fighter.wins, losses: fighter.losses, age: fighter.age });
      eloMap.set(fighter.id, seeded);
      if (seeded !== 1300) seededFromRecord++;
    }
  }
  console.log(`Fighters seeded from career record (no Fight rows): ${fighters.length - fightParticipants.size} (${seededFromRecord} non-1300)`);
  console.log("Elo calculation complete. Saving to database...");

  // ── Step 3: Save in batches — fresh connection per batch ──────────────────
  const fighterIds = Array.from(eloMap.keys());
  const BATCH_SIZE  = 500;
  const CHUNK_SIZE  = 25;   // parallel updates inside a batch
  const MAX_RETRIES = 3;
  let updatedCount  = 0;

  for (let i = 0; i < fighterIds.length; i += BATCH_SIZE) {
    const batch = fighterIds.slice(i, i + BATCH_SIZE);
    let attempt = 0;
    let success = false;

    while (!success && attempt < MAX_RETRIES) {
      attempt++;
      const { prisma: savePrisma, cleanup: cleanupSave } = freshClient();
      try {
        for (let j = 0; j < batch.length; j += CHUNK_SIZE) {
          const chunk = batch.slice(j, j + CHUNK_SIZE);
          await Promise.all(
            chunk.map(id =>
              savePrisma.fighter.update({
                where: { id },
                data: { eloRating: eloMap.get(id) },
              })
            )
          );
        }
        success = true;
      } catch (err: any) {
        console.warn(`  Batch ${i / BATCH_SIZE + 1} attempt ${attempt} failed: ${err?.message}. Retrying...`);
        await sleep(3000 * attempt); // back-off: 3s, 6s, 9s
      } finally {
        await cleanupSave();
      }
    }

    if (!success) {
      throw new Error(`Batch starting at index ${i} failed after ${MAX_RETRIES} attempts.`);
    }

    updatedCount += batch.length;
    console.log(`Saved ${updatedCount} / ${fighterIds.length} fighters...`);
  }

  console.log("✓ Successfully recalculated and saved all Elo ratings.");
}

// ── CLI entrypoint ─────────────────────────────────────────────────────────────
if (require.main === module) {
  recalculateAllElo()
    .then(() => process.exit(0))
    .catch(e => {
      console.error("Fatal error:", e);
      process.exit(1);
    });
}
