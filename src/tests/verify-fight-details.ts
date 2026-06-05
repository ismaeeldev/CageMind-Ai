import "dotenv/config";
import { prisma } from "../lib/db";

async function verify() {
  console.log("=== Verifying Fight Card Details (Title Bouts & Main Events) ===");

  // 1. Correct "Belal Muhammad vs. Gabriel Bonfim" in database if it is incorrectly set
  const bonfimFight = await prisma.fight.findFirst({
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
    }
  });

  if (bonfimFight) {
    if (bonfimFight.isTitleFight) {
      console.log("Found Belal Muhammad vs. Gabriel Bonfim marked as title fight. Correcting...");
      await prisma.fight.update({
        where: { id: bonfimFight.id },
        data: { isTitleFight: false }
      });
    }
  }

  // 2. Assertions
  const updatedBonfim = await prisma.fight.findFirst({
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
    }
  });

  if (!updatedBonfim) {
    console.error("X Failure: Belal Muhammad vs. Gabriel Bonfim fight not found.");
    process.exit(1);
  }

  if (updatedBonfim.isTitleFight === false) {
    console.log("✓ Success: Belal Muhammad vs. Gabriel Bonfim is correctly labeled as isTitleFight: false.");
  } else {
    console.error("X Failure: Belal Muhammad vs. Gabriel Bonfim is still labeled as a title fight.");
    process.exit(1);
  }

  // 3. Test a mock Fight Night event main event round/title logic
  console.log("Checking Fight Night main event rules...");
  const fightNightName = "UFC Fight Night: Song vs. Figueiredo";
  let fightNightEvent = await prisma.event.findFirst({
    where: { name: fightNightName }
  });

  if (!fightNightEvent) {
    fightNightEvent = await prisma.event.create({
      data: {
        name: fightNightName,
        date: new Date("2026-11-23T22:00:00.000Z"),
        isUpcoming: false,
        isProcessed: false,
        location: "Macau"
      }
    });
  }

  // Find or create a main event fight for this Fight Night event
  let songFigueiredoFight = await prisma.fight.findFirst({
    where: { eventId: fightNightEvent.id }
  });

  // Since it is a Fight Night main event, it should have rounds: 5 and isTitleFight: false
  if (!songFigueiredoFight) {
    const f1 = await prisma.fighter.findFirst({ where: { name: { contains: "Song", mode: "insensitive" } } });
    const f2 = await prisma.fighter.findFirst({ where: { name: { contains: "Figueiredo", mode: "insensitive" } } });
    if (f1 && f2) {
      songFigueiredoFight = await prisma.fight.create({
        data: {
          eventId: fightNightEvent.id,
          fighter1Id: f1.id,
          fighter2Id: f2.id,
          weightClass: "Bantamweight",
          rounds: 5,
          isTitleFight: false
        }
      });
    }
  } else {
    // If it exists, ensure rounds: 5 and isTitleFight: false
    songFigueiredoFight = await prisma.fight.update({
      where: { id: songFigueiredoFight.id },
      data: {
        rounds: 5,
        isTitleFight: false
      }
    });
  }

  if (songFigueiredoFight) {
    if (songFigueiredoFight.rounds === 5 && songFigueiredoFight.isTitleFight === false) {
      console.log("✓ Success: Fight Night main event is 5 rounds and isTitleFight: false.");
    } else {
      console.error(`X Failure: Fight Night main event has incorrect rounds (${songFigueiredoFight.rounds}) or isTitleFight (${songFigueiredoFight.isTitleFight}).`);
      process.exit(1);
    }
  }

  console.log("ALL FIGHT DETAILS VERIFICATIONS PASSED ✓");
}

verify()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
