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
  await prisma.event.update({
    where: { id: "6f2962bb-9c38-47ad-997d-893296134001" },
    data: { name: "UFC 317" },
  });
  console.log("Renamed to UFC 317");
  await prisma.$disconnect();
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
