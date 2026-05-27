import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const subs = await prisma.subscription.findMany();
  console.log("Subscriptions in DB:", JSON.stringify(subs, null, 2));
}

main().finally(() => prisma.$disconnect());
