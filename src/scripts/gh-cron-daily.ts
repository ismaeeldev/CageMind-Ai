/**
 * GitHub Actions daily cron — runs at 2:00 AM UTC.
 * Syncs upcoming UFC events, scrapes fight cards, then ensures
 * every upcoming event's main-event fight is correctly flagged.
 */
import "dotenv/config";
import { Scheduler } from "../jobs/scheduler";
import { prisma } from "@/lib/db";
import { fixMainEventFights } from "./fix-main-event-fights";

async function main() {
  console.log("[GH Cron Daily] Starting sync-events...");
  const scheduler = new Scheduler();
  await scheduler.syncEvents();

  console.log("[GH Cron Daily] Fixing main-event fight ordering...");
  const { markedMain, removedDupes } = await fixMainEventFights(prisma as any, false);
  console.log(`[GH Cron Daily] Main events fixed: ${markedMain}, duplicates removed: ${removedDupes}`);

  console.log("[GH Cron Daily] Done.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
