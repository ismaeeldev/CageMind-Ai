import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { FightCardScraper } from "../scrapers/fight-card-scraper";

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
    const event = await prisma.event.findFirst({
      where: { name: { contains: "Holloway", mode: "insensitive" }, isUpcoming: true },
      select: { id: true, name: true, date: true },
    });

    if (!event) { console.log("McGregor vs Holloway 2 event not found"); return; }
    console.log(`Event: ${event.name} (${event.id}) on ${event.date.toISOString().slice(0, 10)}`);

    // PPV slugs to try — UFC numbers near July 2026, plus named variants
    const slugs = [
      "ufc-317",
      "ufc-316",
      "ufc-318",
      "ufc-mcgregor-vs-holloway-2",
      "ufc-conor-mcgregor-vs-max-holloway-2",
      "ufc-fight-night-july-12-2026",
    ];

    for (const slug of slugs) {
      const url = `https://www.ufc.com/event/${slug}`;
      console.log(`\nTrying: ${url}`);
      try {
        const scraper = new FightCardScraper(url, event.id, false);
        await scraper.run();
        const check = await prisma.event.findUnique({
          where: { id: event.id },
          select: { _count: { select: { fights: true } } },
        });
        if (check && check._count.fights > 0) {
          console.log(`✓ Got ${check._count.fights} fights from slug: ${slug}`);
          return;
        }
      } catch (e: any) {
        console.log(`  Error: ${e.message}`);
      }
    }

    console.log("\nNo fights found from any slug — UFC may not have published the card yet.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main().catch(e => { console.error(e); process.exit(1); });
