/**
 * Generates AI predictions for every past fight that has a recorded winner
 * but no predictionHistory entry yet.
 *
 * The PredictionEngine is pure statistical math (ELO + momentum + career),
 * so there are no external API calls — just DB reads and writes.
 *
 * Run this AFTER:
 *   npm run fights:backfill-fn   (imports Fight Night events + results)
 *   npm run elo:recalculate      (refreshes ELO so predictions use current ratings)
 *
 * Usage:
 *   npm run predictions:backfill-dry    # count only
 *   npm run predictions:backfill        # generate and store
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PredictionEngine } from "../lib/prediction-engine";

const DRY_RUN = !process.argv.includes("--execute");
const BATCH_SIZE = 20; // fights per DB read batch
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── DB (Pool+PrismaPg for script context) ────────────────────────────────────

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
  console.log(`\n=== Backfill AI Predictions (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const { prisma, cleanup } = freshClient();

  try {
    // Count fights needing predictions
    const total = await prisma.fight.count({
      where: {
        winnerId: { not: null },
        aiPrediction: null,
        event: { isUpcoming: false },
      },
    });

    console.log(`Fights with results but no predictions: ${total}`);

    if (DRY_RUN) {
      const byEvent = await prisma.event.findMany({
        where: {
          isUpcoming: false,
          fights: { some: { winnerId: { not: null }, aiPrediction: null } },
        },
        select: {
          name: true,
          _count: { select: { fights: true } },
        },
        orderBy: { date: "desc" },
        take: 20,
      });
      console.log("\nTop 20 events that would get predictions:");
      for (const e of byEvent) console.log(`  ${e.name} (${e._count.fights} fights)`);
      console.log("\nDry-run. Run with --execute (npm run predictions:backfill) to apply.");
      return;
    }

    if (total === 0) {
      console.log("All fights already have predictions. Nothing to do.");
      return;
    }

    // Process in pages to avoid loading 10K+ fights into memory at once
    const engine = new PredictionEngine();
    let processed = 0;
    let generated = 0;
    let skipped = 0;

    while (true) {
      // Always skip:0 — processed fights drop out of the result set as aiPrediction gets set
      const fights = await prisma.fight.findMany({
        where: {
          winnerId: { not: null },
          aiPrediction: null,
          event: { isUpcoming: false },
        },
        include: {
          fighter1: true,
          fighter2: true,
          event: { select: { date: true, name: true } },
        },
        orderBy: { event: { date: "asc" } },
        take: BATCH_SIZE,
      });

      if (fights.length === 0) break;

      for (const fight of fights) {
        if (!fight.fighter1 || !fight.fighter2) { skipped++; continue; }

        try {
          const isFiveRounds = fight.isTitleFight;

          const prediction = await engine.generateHypotheticalPrediction(
            fight.fighter1,
            fight.fighter2,
            fight.event?.date,
            isFiveRounds
          );

          await prisma.fight.update({
            where: { id: fight.id },
            data: {
              aiPrediction: prediction.summary,
              aiConfidence: prediction.confidenceScore,
            },
          });

          await prisma.predictionHistory.create({
            data: {
              fightId: fight.id,
              winProbFighter1: prediction.winProbabilityFighter1,
              winProbFighter2: prediction.winProbabilityFighter2,
              confidence: prediction.confidenceScore,
              explanation: prediction.summary,
            },
          });

          generated++;
        } catch (err: any) {
          console.warn(`  [SKIP] fight ${fight.id}: ${err.message}`);
          skipped++;
        }
      }

      processed += fights.length;
      console.log(`  ${generated} predictions generated (${processed} processed so far, ${skipped} skipped)`);

      await sleep(200);
    }

    console.log(`\n── Results ───────────────────────────────────────────────`);
    console.log(`  Generated : ${generated}`);
    console.log(`  Skipped   : ${skipped}`);
    console.log(`\nNext: The Performance Tab will now show predictions for these fights.`);
  } finally {
    await cleanup();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
