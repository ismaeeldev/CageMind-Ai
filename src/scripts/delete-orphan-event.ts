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
    // Find the orphan: name="Kape vs Horiguchi", 0 fights
    const orphan = await prisma.event.findFirst({
      where: { name: "Kape vs Horiguchi" },
      include: { _count: { select: { fights: true } } },
    });

    if (!orphan) {
      console.log("No event named 'Kape vs Horiguchi' found — nothing to delete.");
      return;
    }

    console.log(`Found: id=${orphan.id} name="${orphan.name}" date=${orphan.date.toISOString().slice(0,10)} fights=${orphan._count.fights}`);

    if (orphan._count.fights > 0) {
      console.log("Event has fights — refusing to delete. This doesn't look like the orphan.");
      return;
    }

    await prisma.event.delete({ where: { id: orphan.id } });
    console.log(`Deleted orphan event: ${orphan.id}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main().catch(e => { console.error(e); process.exit(1); });
