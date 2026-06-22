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

const CLASSES = ["Strawweight","Flyweight","Bantamweight","Featherweight","Lightweight","Welterweight","Middleweight","Light Heavyweight","Heavyweight"];
const CLASS_RE = new RegExp(CLASSES.join("|"), "i");

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false }, max: 3 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const dirty = await prisma.fighter.findMany({
    where: { weightClass: { contains: "\n" } },
    select: { id: true, weightClass: true },
  });

  console.log(`Dirty weightClass records: ${dirty.length}`);
  let fixed = 0;

  for (const f of dirty) {
    const m = f.weightClass?.match(CLASS_RE);
    if (m) {
      await prisma.fighter.update({ where: { id: f.id }, data: { weightClass: m[0] } });
      fixed++;
    }
  }

  console.log(`Fixed: ${fixed}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
