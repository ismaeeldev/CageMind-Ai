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

  const total = await prisma.fighter.count();

  const noPhoto = await prisma.fighter.count({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" },
        { imageUrl: "null" },
        { imageUrl: "undefined" },
        { imageUrl: "N/A" },
      ],
    },
  });

  const zeroRecord = await prisma.fighter.count({
    where: { wins: 0, losses: 0, draws: 0 },
  });

  const noUfcId = await prisma.fighter.count({ where: { ufcId: null } });

  // Sample fighters with no photo that appear in fights
  const missingPhotoWithFights = await prisma.fighter.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" },
        { imageUrl: "null" },
        { imageUrl: "N/A" },
      ],
      OR: [
        { fightsAsFighter1: { some: {} } },
        { fightsAsFighter2: { some: {} } },
      ],
    },
    select: { name: true, wins: true, losses: true, draws: true, imageUrl: true, ufcId: true },
    take: 10,
    orderBy: [
      { fightsAsFighter1: { _count: "desc" } },
    ],
  });

  console.log(`\n=== Fighter Data Audit ===`);
  console.log(`Total fighters     : ${total}`);
  console.log(`Missing photo      : ${noPhoto} (${((noPhoto/total)*100).toFixed(1)}%)`);
  console.log(`Zero record (0-0-0): ${zeroRecord} (${((zeroRecord/total)*100).toFixed(1)}%)`);
  console.log(`No ufcId           : ${noUfcId} (${((noUfcId/total)*100).toFixed(1)}%)`);
  console.log(`\nSample fighters missing photo (who appear in fights):`);
  missingPhotoWithFights.forEach(f =>
    console.log(`  ${f.name} | ${f.wins}-${f.losses}-${f.draws} | ufcId: ${f.ufcId ?? "none"}`)
  );

  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
