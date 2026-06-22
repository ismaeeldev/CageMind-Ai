/**
 * GitHub Actions daily cron — runs at 2:00 AM UTC.
 * Syncs upcoming UFC events and scrapes fight cards.
 */
import "dotenv/config";
import { Scheduler } from "../jobs/scheduler";

async function main() {
  console.log("[GH Cron Daily] Starting sync-events...");
  const scheduler = new Scheduler();
  await scheduler.syncEvents();
  console.log("[GH Cron Daily] Done.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
