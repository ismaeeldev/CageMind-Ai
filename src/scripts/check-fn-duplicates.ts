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

const SHORT_NAMES = [
  "Muhammad vs Bonfim",
  "Song vs Figueiredo",
  "Allen vs Costa",
  "Chimaev vs Strickland",
  "Della Maddalena vs Prates",
  "Sterling vs Zalal",
  "Burns vs Malott",
  "Prochazka vs Ulberg",
  "Moicano vs Duncan",
  "Adesanya vs Pyfer",
];

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  for (const short of SHORT_NAMES) {
    const [last1, last2] = short.split(" vs ").map(s => s.trim().split(" ").pop()!.toLowerCase());

    // Find all events whose name contains both last names
    const matches = await prisma.event.findMany({
      where: {
        AND: [
          { name: { contains: last1, mode: "insensitive" } },
          { name: { contains: last2, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, date: true, _count: { select: { fights: true } } },
      orderBy: { date: "asc" },
    });

    const withFights = matches.filter(e => e._count.fights > 0);
    const empty = matches.filter(e => e._count.fights === 0);

    const statusIcon = withFights.length > 0 ? "✓" : "✗";
    console.log(`\n${statusIcon} ${short}`);
    matches.forEach(e => {
      const d = new Date(e.date).toISOString().split("T")[0];
      console.log(`    ${e._count.fights > 0 ? "HAS FIGHTS" : "empty     "} | ${d} | ${e.name}`);
    });
    if (matches.length === 0) console.log(`    (no event found in DB)`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
