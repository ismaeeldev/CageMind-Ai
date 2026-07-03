import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  try {
    // June/July 2026 events
    const recent = await prisma.event.findMany({
      where: { date: { gte: new Date("2026-06-01") } },
      select: {
        id: true, name: true, isUpcoming: true, date: true,
        _count: { select: { fights: true } },
        fights: { select: { winnerId: true, aiPrediction: true }, take: 1, orderBy: { isTitleFight: "desc" } },
      },
      orderBy: { date: "asc" },
    });

    console.log("\n══ All June/July 2026 events ══");
    for (const e of recent) {
      const hasWinner = e.fights.some(f => f.winnerId);
      const hasAI = e.fights.some(f => f.aiPrediction);
      console.log(`  [${e.isUpcoming ? "UPCOMING" : "PAST    "}] ${e.date.toISOString().slice(0,10)} | fights=${e._count.fights} winner=${hasWinner} ai=${hasAI} | ${e.name}`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main().catch(e => { console.error(e); process.exit(1); });
