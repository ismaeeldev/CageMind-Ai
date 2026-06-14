import { prisma } from "../lib/db";

async function verifyKnownFighters() {
  console.log("=== Verifying Known Active Fighters in Database ===");
  const fighters = ["Jon Jones", "Conor McGregor"];
  
  for (const name of fighters) {
    const fighter = await prisma.fighter.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
    
    if (fighter) {
      console.log(`Fighter: ${fighter.name}`);
      console.log(`- isActive: ${fighter.isActive} (Expected: true)`);
      if (fighter.isActive) {
        console.log(`✓ PASS: ${fighter.name} is active.`);
      } else {
        console.error(`X FAIL: ${fighter.name} is retired/inactive.`);
      }
    } else {
      console.log(`Fighter: ${name} not found in database.`);
    }
  }
}

verifyKnownFighters()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
