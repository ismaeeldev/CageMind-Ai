import { PrismaClient } from "./src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import 'dotenv/config';

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
});
const prisma = new PrismaClient({ adapter });

const fightersData = [
  { name: "Islam Makhachev", weightClass: "Lightweight", age: 32, height: 70, reach: 70.5, wins: 25, losses: 1, draws: 0, koWins: 5, subWins: 11, eloRating: 2150 },
  { name: "Jon Jones", weightClass: "Heavyweight", age: 36, height: 76, reach: 84.5, wins: 27, losses: 1, draws: 0, koWins: 10, subWins: 7, eloRating: 2200 },
  { name: "Leon Edwards", weightClass: "Welterweight", age: 32, height: 74, reach: 74, wins: 22, losses: 3, draws: 0, koWins: 7, subWins: 3, eloRating: 2050 },
  { name: "Ilia Topuria", weightClass: "Featherweight", age: 27, height: 67, reach: 69, wins: 15, losses: 0, draws: 0, koWins: 5, subWins: 8, eloRating: 2080 },
  { name: "Alex Pereira", weightClass: "Light Heavyweight", age: 36, height: 76, reach: 79, wins: 10, losses: 2, draws: 0, koWins: 8, subWins: 0, eloRating: 2120 },
  { name: "Sean O'Malley", weightClass: "Bantamweight", age: 29, height: 71, reach: 72, wins: 18, losses: 1, draws: 0, koWins: 12, subWins: 1, eloRating: 2040 },
  { name: "Dricus Du Plessis", weightClass: "Middleweight", age: 30, height: 73, reach: 76, wins: 21, losses: 2, draws: 0, koWins: 9, subWins: 10, eloRating: 2010 },
  { name: "Alexandre Pantoja", weightClass: "Flyweight", age: 33, height: 65, reach: 67, wins: 27, losses: 5, draws: 0, koWins: 8, subWins: 10, eloRating: 1980 },
  { name: "Tom Aspinall", weightClass: "Heavyweight", age: 30, height: 77, reach: 78, wins: 14, losses: 3, draws: 0, koWins: 10, subWins: 4, eloRating: 2090 },
  { name: "Max Holloway", weightClass: "Featherweight", age: 32, height: 71, reach: 69, wins: 26, losses: 7, draws: 0, koWins: 12, subWins: 2, eloRating: 2110 },
  { name: "Justin Gaethje", weightClass: "Lightweight", age: 35, height: 71, reach: 71, wins: 25, losses: 4, draws: 0, koWins: 20, subWins: 1, eloRating: 2060 },
  { name: "Dustin Poirier", weightClass: "Lightweight", age: 35, height: 69, reach: 72, wins: 30, losses: 8, draws: 0, koWins: 15, subWins: 8, eloRating: 2030 }
];

async function main() {
  console.log("Seeding fighters...");
  for (const f of fightersData) {
    await prisma.fighter.upsert({
      where: { name: f.name },
      update: f,
      create: f
    });
  }
  console.log("Seeded " + fightersData.length + " fighters.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
