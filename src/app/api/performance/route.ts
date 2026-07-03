import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isPremium = session?.user?.isPremium === true;
    if (!isPremium) {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
    }

    // Fetch all past fights that have both an AI prediction AND a recorded winner
    const gradedFights = await prisma.fight.findMany({
      where: {
        event: { isUpcoming: false },
        aiPrediction: { not: null },
        winnerId: { not: null },
      },
      include: {
        fighter1: { select: { id: true, name: true } },
        fighter2: { select: { id: true, name: true } },
        event: { select: { id: true, name: true, date: true } },
        predictionHistory: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy: { event: { date: "asc" } },
    });

    // Unit sizing based on AI confidence:
    // <60% → 0u (no wager)  60–64.9% → 0.5u  65–69.9% → 0.75u
    // 70–79.9% → 1u  80–89.9% → 2u  90%+ → 5u
    function getUnits(conf: number): number {
      if (conf >= 0.90) return 5;
      if (conf >= 0.80) return 2;
      if (conf >= 0.70) return 1;
      if (conf >= 0.65) return 0.75;
      if (conf >= 0.60) return 0.5;
      return 0;
    }

    // Grade each fight
    const gradedPicks = gradedFights.map((fight) => {
      const history = fight.predictionHistory[0];
      if (!history) return null;

      // Determine AI's pick (fighter with higher predicted probability)
      const aiPickedFighter1 = history.winProbFighter1 >= history.winProbFighter2;
      const aiPickedWinnerId = aiPickedFighter1 ? fight.fighter1Id : fight.fighter2Id;

      const isCorrect = aiPickedWinnerId === fight.winnerId;
      const confidence = history.confidence; // 0-1 scale
      const isHighConfidence = confidence >= 0.70;

      const units = getUnits(confidence);
      const wager = units * 100; // 1u = $100

      const rawOdds = aiPickedFighter1 ? fight.oddsFighter1 : fight.oddsFighter2;
      const hasOdds = rawOdds !== null;

      let profit: number | null = null;
      if (units === 0) {
        profit = null; // below 60% confidence — no wager, excluded from P/L
      } else if (hasOdds) {
        const aiOdds = rawOdds!;
        if (isCorrect) {
          profit = aiOdds > 0 ? (wager * aiOdds / 100) : (wager * 100 / Math.abs(aiOdds));
        } else {
          profit = -wager;
        }
      } else {
        // No odds — flat default scaled by units
        profit = isCorrect ? units * 50 : -wager;
      }

      return {
        fightId: fight.id,
        eventId: fight.event.id,
        eventName: fight.event.name,
        eventDate: fight.event.date,
        fighter1Name: fight.fighter1.name,
        fighter2Name: fight.fighter2.name,
        aiPickedFighter: aiPickedFighter1 ? fight.fighter1.name : fight.fighter2.name,
        actualWinner: aiPickedFighter1 === isCorrect ? fight.fighter1.name : fight.fighter2.name,
        isCorrect,
        confidence,
        isHighConfidence,
        units,
        wager,
        profit,
        odds: rawOdds,
      };
    }).filter(Boolean) as {
      fightId: string; eventId: string; eventName: string; eventDate: Date;
      fighter1Name: string; fighter2Name: string; aiPickedFighter: string;
      actualWinner: string; isCorrect: boolean; confidence: number;
      isHighConfidence: boolean; units: number; wager: number;
      profit: number | null; odds: number | null;
    }[];

    // ── Helper: compute aggregate stats ──────────────────────────────────
    const computeStats = (picks: typeof gradedPicks) => {
      if (picks.length === 0) {
        return {
          total: 0, correct: 0, accuracy: 0, totalProfit: null, roi: null,
          eventsGraded: 0, timeline: [], oddsAvailable: false,
        };
      }

      // Only include fights that have real odds data (or are losses, which cost $100 regardless)
      const picksWithOdds = picks.filter((p) => p.profit !== null);
      const oddsAvailable = picksWithOdds.some((p) => p.odds !== null);

      const eventIds = new Set(picks.map((p) => p.eventId));
      let cumBankroll = 1000;
      const timeline: {
        eventId: string;
        eventName: string;
        date: string;
        correct: number;
        total: number;
        roi: number;
        cumulativeBankroll: number;
        rollingWinRate: number;
        picks: any[];
      }[] = [];

      const byEvent = picks.reduce((acc, pick) => {
        if (!acc[pick.eventId]) acc[pick.eventId] = { eventName: pick.eventName, date: pick.eventDate, picks: [] };
        acc[pick.eventId].picks.push(pick);
        return acc;
      }, {} as Record<string, { eventName: string; date: Date; picks: typeof gradedPicks }>);

      let totalCorrectSoFar = 0;
      let totalPicksSoFar = 0;

      Object.values(byEvent).forEach((evt) => {
        const picksCount = evt.picks.length;
        if (picksCount === 0) return;

        const evtCorrect = evt.picks.filter((p) => p.isCorrect).length;
        // Only sum non-null profits (wins with real odds + all losses)
        const evtProfit = evt.picks.reduce((s, p) => p.profit !== null ? s + p.profit : s, 0);
        const evtWager = evt.picks.reduce((s, p) => p.profit !== null ? s + p.wager : s, 0);

        const rawROI = evtWager > 0 ? (evtProfit / evtWager) * 100 : 0;
        const evtROI = isNaN(rawROI) ? 0 : rawROI;

        cumBankroll += evtProfit;
        if (isNaN(cumBankroll)) cumBankroll = 1000;

        totalCorrectSoFar += evtCorrect;
        totalPicksSoFar += picksCount;

        const rollingWinRate = totalPicksSoFar > 0 ? (totalCorrectSoFar / totalPicksSoFar) * 100 : 0;
        const eventName = evt.eventName ? evt.eventName.split(":")[0].trim() : "Unknown Event";
        const dateStr = evt.date ? (evt.date instanceof Date ? evt.date.toISOString().split("T")[0] : new Date(evt.date).toISOString().split("T")[0]) : "";

        timeline.push({
          eventId: evt.picks[0]?.eventId || "",
          eventName,
          date: dateStr,
          correct: evtCorrect,
          total: picksCount,
          roi: isNaN(evtROI) ? 0 : parseFloat(evtROI.toFixed(1)),
          cumulativeBankroll: isNaN(cumBankroll) ? 1000 : parseFloat(cumBankroll.toFixed(2)),
          rollingWinRate: isNaN(rollingWinRate) ? 0 : parseFloat(rollingWinRate.toFixed(1)),
          picks: evt.picks,
        });
      });

      const totalCorrect = picks.filter((p) => p.isCorrect).length;
      const totalProfit = picksWithOdds.reduce((s, p) => s + p.profit!, 0);
      const totalWager = picksWithOdds.reduce((s, p) => s + p.wager, 0);

      const rawAccuracy = picks.length > 0 ? (totalCorrect / picks.length) * 100 : 0;

      return {
        total: picks.length,
        correct: totalCorrect,
        accuracy: parseFloat(rawAccuracy.toFixed(1)) || 0,
        totalProfit: oddsAvailable ? parseFloat(totalProfit.toFixed(2)) : null,
        roi: oddsAvailable && totalWager > 0 ? parseFloat(((totalProfit / totalWager) * 100).toFixed(1)) : null,
        eventsGraded: eventIds.size,
        timeline,
        oddsAvailable,
      };
    };

    const allStats = computeStats(gradedPicks);
    const highConfStats = computeStats(gradedPicks.filter((p) => p.isHighConfidence));

    return NextResponse.json({ allStats, highConfStats });
  } catch (error: any) {
    console.error("Performance API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
