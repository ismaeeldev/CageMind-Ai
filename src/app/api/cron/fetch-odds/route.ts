import { NextResponse } from "next/server";
import { fetchLiveOdds } from "@/scripts/fetch-odds";

export async function GET(req: Request) {
  // Validate cron secret if required by Vercel
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fetchLiveOdds();
    return NextResponse.json({ success: true, message: "Successfully synced live odds" });
  } catch (error: any) {
    console.error("Odds sync failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
