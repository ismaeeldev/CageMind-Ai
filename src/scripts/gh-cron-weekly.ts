/**
 * GitHub Actions weekly cron — runs Sundays at 4:00 AM UTC.
 * Processes completed events, generates AI predictions, rebuilds ELO.
 */
import "dotenv/config";
import { Scheduler } from "../jobs/scheduler";

async function main() {
  console.log("[GH Cron Weekly] Starting process-results...");
  const scheduler = new Scheduler();
  await scheduler.processResults();
  console.log("[GH Cron Weekly] Done.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
