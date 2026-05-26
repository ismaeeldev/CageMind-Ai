import { PrismaClient } from "./src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import 'dotenv/config';

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding events...");

  // Get some fighters
  const islam = await prisma.fighter.findUnique({ where: { name: "Islam Makhachev" } });
  const dustin = await prisma.fighter.findUnique({ where: { name: "Dustin Poirier" } });
  
  const jon = await prisma.fighter.findUnique({ where: { name: "Jon Jones" } });
  const tom = await prisma.fighter.findUnique({ where: { name: "Tom Aspinall" } });
  
  const max = await prisma.fighter.findUnique({ where: { name: "Max Holloway" } });
  const justin = await prisma.fighter.findUnique({ where: { name: "Justin Gaethje" } });

  if (!islam || !dustin || !jon || !tom || !max || !justin) {
    console.error("Fighters not found! Make sure to run seed-fighters.ts first.");
    process.exit(1);
  }

  // Create Past Event (e.g., UFC 300)
  const event1 = await prisma.event.create({
    data: {
      name: "UFC 300: Pereira vs. Hill",
      date: new Date("2024-04-13T22:00:00Z"),
      location: "T-Mobile Arena, Las Vegas, NV",
      isUpcoming: false,
      fights: {
        create: [
          {
            fighter1Id: max.id,
            fighter2Id: justin.id,
            weightClass: "Lightweight",
            isTitleFight: true, // BMF
            rounds: 5,
            winnerId: max.id,
            method: "KO/TKO",
            endingRound: 5,
            endingTime: "4:59",
            oddsFighter1: 140,
            oddsFighter2: -160,
          }
        ]
      }
    }
  });

  console.log(`Created event: ${event1.name}`);

  // Create Upcoming Event (e.g., UFC 302)
  const event2 = await prisma.event.create({
    data: {
      name: "UFC 302: Makhachev vs. Poirier",
      date: new Date("2024-06-01T22:00:00Z"),
      location: "Prudential Center, Newark, NJ",
      isUpcoming: true,
      fights: {
        create: [
          {
            fighter1Id: islam.id,
            fighter2Id: dustin.id,
            weightClass: "Lightweight",
            isTitleFight: true,
            rounds: 5,
            oddsFighter1: -600,
            oddsFighter2: 400,
          },
          {
            fighter1Id: jon.id, // Not historically accurate for 302, just for seeding data
            fighter2Id: tom.id,
            weightClass: "Heavyweight",
            isTitleFight: true,
            rounds: 5,
            oddsFighter1: -150,
            oddsFighter2: 130,
          }
        ]
      }
    }
  });

  console.log(`Created event: ${event2.name}`);
  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
