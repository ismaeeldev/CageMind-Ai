import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Scheduler } from "@/jobs/scheduler";
import { logger } from "@/lib/logger";

// Fetch job stats
export async function GET() {
  try {
    const executions = await prisma.jobExecution.findMany({
      orderBy: { startedAt: 'desc' },
      take: 100 // Last 100 executions to build stats
    });

    // Group by jobName
    const stats: Record<string, any> = {};

    for (const ex of executions) {
      if (!stats[ex.jobName]) {
        stats[ex.jobName] = {
          jobName: ex.jobName,
          lastRun: ex.startedAt,
          status: ex.status,
          successCount: 0,
          failureCount: 0,
          lastDuration: null,
          lastError: null
        };
      }
      
      // We only update lastRun/status from the very first one we encounter (since order is desc)
      if (ex.status === "SUCCESS") stats[ex.jobName].successCount++;
      if (ex.status === "FAILED") stats[ex.jobName].failureCount++;
      
      if (!stats[ex.jobName].lastDuration && ex.durationMs) {
        stats[ex.jobName].lastDuration = ex.durationMs;
      }
      if (!stats[ex.jobName].lastError && ex.error) {
        stats[ex.jobName].lastError = ex.error;
      }
    }

    return NextResponse.json({ jobs: Object.values(stats) });
  } catch (error: any) {
    logger.error("Failed to fetch jobs stats", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Trigger manual run
export async function POST(req: Request) {
  try {
    const { jobType } = await req.json(); // 'daily' or 'weekly'
    
    if (!['daily', 'weekly'].includes(jobType)) {
      return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
    }

    const scheduler = new Scheduler();
    
    // We do NOT await this directly because it could take minutes and Vercel/Next.js would timeout the API.
    // By triggering it asynchronously, it runs in the background of the Node process.
    // JobRunner will track its state in DB!
    scheduler.triggerManual(jobType as 'daily' | 'weekly').catch(e => {
      logger.error("Manual trigger crashed asynchronously", e);
    });

    return NextResponse.json({ message: `Triggered ${jobType} jobs successfully in background.` });
  } catch (error: any) {
    logger.error("Failed to trigger job", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
