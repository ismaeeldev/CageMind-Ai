/**
 * Renames "Unknown" Fight Night events using their fight card data.
 * Name format: "UFC Fight Night: Fighter1 vs. Fighter2" (using first fight on card)
 * Falls back to date-based name if no fights exist.
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

async function main() {
  console.log(`\n=== Fix Unknown Event Names (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const unknownEvents = await prisma.event.findMany({
      where: { name: "Unknown" },
      include: {
        fights: {
          include: {
            fighter1: { select: { name: true } },
            fighter2: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    console.log(`Found ${unknownEvents.length} events named "Unknown"\n`);

    let renamed = 0;
    for (const event of unknownEvents) {
      const d = new Date(event.date);
      const dateStr = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

      let name: string;
      const fight = event.fights[0];
      if (fight?.fighter1?.name && fight?.fighter2?.name) {
        name = `UFC Fight Night: ${fight.fighter1.name} vs. ${fight.fighter2.name}`;
      } else {
        name = `UFC Fight Night (${dateStr})`;
      }

      console.log(`  ${dateStr} → ${name}`);

      if (!DRY_RUN) {
        await prisma.event.update({ where: { id: event.id }, data: { name } });
        renamed++;
      }
    }

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to apply.`);
    } else {
      console.log(`\nRenamed ${renamed} events.`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
