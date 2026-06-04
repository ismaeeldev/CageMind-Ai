import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const retiredFighters = await prisma.fighter.findMany({
    where: { isActive: false },
    select: { name: true, isActive: true, ufcId: true },
    take: 10
  });
  console.log("RETIRED_FIGHTERS_START");
  console.log(JSON.stringify(retiredFighters, null, 2));
  console.log("RETIRED_FIGHTERS_END");
}

main().finally(() => prisma.$disconnect());
