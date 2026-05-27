import { NextResponse } from "next/server";
import { Scheduler } from "@/jobs/scheduler";
import { logger } from "@/lib/logger";

export const maxDuration = 300; // 5 minutes

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn("[Cron: Sync Fighters] Unauthorized execution attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("[Cron] Triggering Sync Fighters...");
    
    const scheduler = new Scheduler();
    await scheduler.syncFighters();
    
    return NextResponse.json({ 
      success: true,
      message: "Sync Fighters completed successfully." 
    });
  } catch (error: any) {
    logger.error("[Cron: Sync Fighters] Failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
