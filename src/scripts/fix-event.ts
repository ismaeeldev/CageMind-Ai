import { prisma } from "../lib/db";

async function main() {
  const event = await prisma.event.findFirst({
    where: { name: { contains: "Song vs" } }
  });

  if (event) {
    console.log("Found event:", event.name);
    await prisma.event.update({
      where: { id: event.id },
      data: { isUpcoming: false, date: new Date("2024-11-23T12:00:00Z") } // Ensure it is set to past
    });
    console.log("Updated to past event.");
  } else {
    console.log("Event not found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
