import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function freshClient() {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("uselibpqcompat", "true");
  u.searchParams.set("sslmode", "require");
  const pool = new Pool({ connectionString: u.toString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  return { prisma, cleanup: async () => { try { await prisma.$disconnect(); } catch {} try { await pool.end(); } catch {} } };
}

async function main() {
  const { prisma, cleanup } = freshClient();
  try {
    const total = await prisma.event.count();
    const past = await prisma.event.count({ where: { isUpcoming: false } });
    const fn = await prisma.event.count({ where: { name: { contains: "Fight Night", mode: "insensitive" } } });
    const fnPast = await prisma.event.count({ where: { name: { contains: "Fight Night", mode: "insensitive" }, isUpcoming: false } });
    const fnWithFights = await prisma.event.count({ where: { name: { contains: "Fight Night", mode: "insensitive" }, fights: { some: {} } } });
    const fnWithResults = await prisma.event.count({ where: { name: { contains: "Fight Night", mode: "insensitive" }, fights: { some: { winnerId: { not: null } } } } });
    const fnWithPredictions = await prisma.event.count({ where: { name: { contains: "Fight Night", mode: "insensitive" }, fights: { some: { aiPrediction: { not: null }, winnerId: { not: null } } } } });

    console.log("=== Event DB Audit ===");
    console.log(`Total events         : ${total}`);
    console.log(`Past events          : ${past}`);
    console.log(`Fight Night (any)    : ${fn}`);
    console.log(`Fight Night (past)   : ${fnPast}`);
    console.log(`Fight Night w/fights : ${fnWithFights}`);
    console.log(`Fight Night w/results: ${fnWithResults}`);
    console.log(`Fight Night w/preds  : ${fnWithPredictions}`);

    const samples = await prisma.event.findMany({
      where: { name: { contains: "Fight Night", mode: "insensitive" }, isUpcoming: false },
      include: { _count: { select: { fights: true } } },
      orderBy: { date: "desc" },
      take: 12,
    });
    console.log("\nRecent Fight Night past events:");
    for (const e of samples) {
      console.log(`  ${e.date.toISOString().slice(0,10)}  ${e.name}  | fights: ${e._count.fights}  processed: ${e.isProcessed}`);
    }
  } finally {
    await cleanup();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
