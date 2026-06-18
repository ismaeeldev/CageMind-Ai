import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

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

  // Find all past Fight Night events with no fights
  const emptyFightNights = await prisma.event.findMany({
    where: {
      isUpcoming: false,
      fights: { none: {} },
      NOT: { name: { contains: "UFC " } }, // exclude numbered PPV events
    },
    select: { id: true, name: true, date: true },
    orderBy: { date: "desc" },
  });

  console.log(`\nPast Fight Night events with NO fights: ${emptyFightNights.length}\n`);
  emptyFightNights.forEach(e => {
    const d = new Date(e.date).toISOString().split("T")[0];
    console.log(`  ${d} | ${e.name}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
