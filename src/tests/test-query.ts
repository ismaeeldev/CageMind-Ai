import "dotenv/config";
import { prisma } from "../lib/db";

async function query() {
  const fighters = await prisma.fighter.findMany({
    where: {
      OR: [
        { name: { contains: "Zahabi", mode: "insensitive" } },
        { name: { contains: "Malley", mode: "insensitive" } }
      ]
    }
  });
  console.log(JSON.stringify(fighters, null, 2));
}

query().catch(console.error).finally(() => prisma.$disconnect());
