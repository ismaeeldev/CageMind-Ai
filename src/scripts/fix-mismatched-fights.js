require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");
const { neonConfig } = require("@neondatabase/serverless");
const { PrismaNeon } = require("@prisma/adapter-neon");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting correction of mismatched fighters in database...");

  // 1. Ensure Gabriel Bonfim and Manuel Torres exist
  let gabriel = await prisma.fighter.findFirst({
    where: { name: { equals: "Gabriel Bonfim", mode: "insensitive" } }
  });
  if (!gabriel) {
    gabriel = await prisma.fighter.create({
      data: { name: "Gabriel Bonfim", weightClass: "Welterweight", eloRating: 1500, isActive: true }
    });
    console.log("Created Gabriel Bonfim in database.");
  }

  let manuel = await prisma.fighter.findFirst({
    where: { name: { equals: "Manuel Torres", mode: "insensitive" } }
  });
  if (!manuel) {
    manuel = await prisma.fighter.create({
      data: { name: "Manuel Torres", weightClass: "Lightweight", eloRating: 1500, isActive: true }
    });
    console.log("Created Manuel Torres in database.");
  }

  // Find Ismael Bonfim and Ronys Torres to identify their IDs
  const ismael = await prisma.fighter.findFirst({
    where: { name: { equals: "Ismael Bonfim", mode: "insensitive" } }
  });
  const ronys = await prisma.fighter.findFirst({
    where: { name: { equals: "Ronys Torres", mode: "insensitive" } }
  });

  // 2. Correct Ismael Bonfim -> Gabriel Bonfim in fights
  if (ismael) {
    const f1Updates = await prisma.fight.updateMany({
      where: { fighter1Id: ismael.id, event: { name: { contains: "Bonfim", mode: "insensitive" } } },
      data: { fighter1Id: gabriel.id }
    });
    const f2Updates = await prisma.fight.updateMany({
      where: { fighter2Id: ismael.id, event: { name: { contains: "Bonfim", mode: "insensitive" } } },
      data: { fighter2Id: gabriel.id }
    });
    console.log(`Swapped Ismael Bonfim to Gabriel Bonfim in ${f1Updates.count + f2Updates.count} fights.`);
  }

  // 3. Correct Ronys Torres -> Manuel Torres in fights
  if (ronys) {
    const f1Updates = await prisma.fight.updateMany({
      where: { fighter1Id: ronys.id, event: { name: { contains: "Torres", mode: "insensitive" } } },
      data: { fighter1Id: manuel.id }
    });
    const f2Updates = await prisma.fight.updateMany({
      where: { fighter2Id: ronys.id, event: { name: { contains: "Torres", mode: "insensitive" } } },
      data: { fighter2Id: manuel.id }
    });
    console.log(`Swapped Ronys Torres to Manuel Torres in ${f1Updates.count + f2Updates.count} fights.`);
  }
}

main().finally(() => prisma.$disconnect());
