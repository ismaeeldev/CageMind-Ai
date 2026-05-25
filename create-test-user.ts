import { PrismaClient } from "./src/generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "teststripe@example.com" },
    update: {},
    create: {
      email: "teststripe@example.com",
      name: "Stripe Tester",
      passwordHash: "dummy", // Not real
    },
  });

  console.log(user.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
