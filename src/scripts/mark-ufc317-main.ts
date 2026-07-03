import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("sslmode", "require");
  const pool = new Pool({ connectionString: u.toString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const event = await prisma.event.findUnique({
    where: { id: "6f2962bb-9c38-47ad-997d-893296134001" },
    include: {
      fights: {
        include: { fighter1: { select: { name: true } }, fighter2: { select: { name: true } } },
        orderBy: { isTitleFight: "desc" },
      },
    },
  });

  if (!event) { console.log("Event not found"); return; }
  console.log(`\nEvent: ${event.name} — ${event.fights.length} fights`);

  for (const f of event.fights) {
    console.log(`  [${f.isTitleFight ? "MAIN" : "    "}] ${f.fighter1.name} vs ${f.fighter2.name}`);
  }

  // Find the McGregor vs Holloway fight
  const mainFight = event.fights.find(f =>
    (f.fighter1.name.toLowerCase().includes("mcgregor") || f.fighter2.name.toLowerCase().includes("mcgregor")) &&
    (f.fighter1.name.toLowerCase().includes("holloway") || f.fighter2.name.toLowerCase().includes("holloway"))
  );

  if (!mainFight) {
    // Fallback: mark the first fight (usually main event in UFC ordering)
    console.log("\nMcGregor/Holloway fight not found by name — marking first fight as main event");
    if (event.fights.length > 0) {
      await prisma.fight.update({ where: { id: event.fights[0].id }, data: { isTitleFight: true } });
      console.log(`Marked: ${event.fights[0].fighter1.name} vs ${event.fights[0].fighter2.name}`);
    }
  } else {
    await prisma.fight.update({ where: { id: mainFight.id }, data: { isTitleFight: true } });
    console.log(`\nMarked main event: ${mainFight.fighter1.name} vs ${mainFight.fighter2.name}`);
  }

  await prisma.$disconnect();
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
