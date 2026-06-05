import "dotenv/config";
import { prisma } from "../lib/db";

async function query() {
  const fight = await prisma.fight.findFirst({
    where: {
      OR: [
        {
          fighter1: { name: { contains: "Bonfim", mode: "insensitive" } },
          fighter2: { name: { contains: "Muhammad", mode: "insensitive" } }
        },
        {
          fighter1: { name: { contains: "Muhammad", mode: "insensitive" } },
          fighter2: { name: { contains: "Bonfim", mode: "insensitive" } }
        }
      ]
    },
    include: {
      fighter1: true,
      fighter2: true,
      event: true
    }
  });
  console.log("Fight:", JSON.stringify(fight, null, 2));
}

query().catch(console.error).finally(() => prisma.$disconnect());
