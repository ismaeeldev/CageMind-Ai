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
  // 1. Mark active fighters as active
  const activeFighters = ["Sean Strickland", "Paulo Costa", "Israel Adesanya", "Jon Jones", "Conor McGregor"];
  for (const name of activeFighters) {
    const updated = await prisma.fighter.updateMany({
      where: { name: { contains: name, mode: "insensitive" } },
      data: { isActive: true }
    });
    console.log(`Updated ${name} to Active:`, updated.count);
  }

  // 2. Mark actually retired fighters as retired
  const retiredFighters = ["Khabib Nurmagomedov", "Georges St-Pierre", "Daniel Cormier", "Brock Lesnar", "Anderson Silva", "Urijah Faber"];
  for (const name of retiredFighters) {
    const updated = await prisma.fighter.updateMany({
      where: { name: { contains: name, mode: "insensitive" } },
      data: { isActive: false }
    });
    console.log(`Updated ${name} to Retired:`, updated.count);
  }
}

main().finally(() => prisma.$disconnect());
