/**
 * Resets isProcessed=false for all Fight Night events that have fight results
 * but no AI predictions yet, so PostEventProcessor can generate them.
 *
 * Run this once after backfill-fight-nights if the backfill accidentally
 * set isProcessed=true before predictions were generated.
 *
 * Usage:  tsx src/scripts/reset-fn-processed.ts
 */
import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function freshClient() {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    const pool = new Pool({ connectionString: u.toString(), ssl: { rejectUnauthorized: false }, max: 3 });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
    const cleanup = async () => { try { await prisma.$disconnect(); } catch {} try { await pool.end(); } catch {} };
    return { prisma, cleanup };
  } catch {
    throw new Error("Could not parse DATABASE_URL");
  }
}

async function main() {
  const { prisma, cleanup } = freshClient();
  try {
    // Find Fight Night events that are processed but have fights with no predictions
    const events = await prisma.event.findMany({
      where: {
        name: { contains: "Fight Night", mode: "insensitive" },
        isUpcoming: false,
        isProcessed: true,
        fights: {
          some: {
            winnerId: { not: null },
            aiPrediction: null,
          },
        },
      },
      select: { id: true, name: true },
    });

    console.log(`Found ${events.length} Fight Night events processed but missing predictions.`);

    if (events.length > 0) {
      const result = await prisma.event.updateMany({
        where: { id: { in: events.map(e => e.id) } },
        data: { isProcessed: false },
      });
      console.log(`Reset isProcessed=false for ${result.count} events.`);
      console.log("The scheduler's processResults() will now generate AI predictions for these events.");
    } else {
      console.log("Nothing to reset.");
    }
  } finally {
    await cleanup();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
