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
  const upcomingEvents = await prisma.event.findMany({
    where: { isUpcoming: true },
    include: {
      _count: {
        select: { fights: true }
      }
    }
  });
  console.log("UPCOMING_EVENTS:");
  console.log(JSON.stringify(upcomingEvents, null, 2));
}

main().finally(() => prisma.$disconnect());
