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

  const events = await prisma.event.findMany({
    where: { name: { contains: "UFC " } },
    select: { name: true, date: true, _count: { select: { fights: true } } },
  });

  const numbered = events.filter(e => /^UFC \d+$/.test(e.name.trim()));
  const withFights = numbered.filter(e => e._count.fights > 0);
  const empty = numbered.filter(e => e._count.fights === 0);

  const emptyNums = empty.map(e => parseInt(e.name.replace("UFC ", ""))).sort((a, b) => a - b);

  console.log(`Numbered UFC events total : ${numbered.length}`);
  console.log(`With fights (done)        : ${withFights.length}`);
  console.log(`Empty (need scraping)     : ${empty.length}`);
  if (emptyNums.length > 0) {
    console.log(`Empty range: UFC ${emptyNums[0]} – UFC ${emptyNums[emptyNums.length - 1]}`);
    console.log(`Empty list : ${emptyNums.join(", ")}`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
