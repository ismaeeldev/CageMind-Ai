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

    // Grade each fight
    const gradedPicks = gradedFights.map((fight) => {
      const history = fight.predictionHistory[0];
      if (!history) return null;

      // Determine AI's pick (fighter with higher predicted probability)
      const aiPickedFighter1 = history.winProbFighter1 >= history.winProbFighter2;
      const aiPickedWinnerId = aiPickedFighter1 ? fight.fighter1Id : fight.fighter2Id;

      const isCorrect = aiPickedWinnerId === fight.winnerId;
      const confidence = history.confidence; // 0-1 scale
      const isHighConfidence = confidence >= 0.6;

      // Flat $100 unit bet ROI calculation
      // Determine the odds for the AI's pick (fallback to -110 if missing)
      const rawOdds = aiPickedFighter1 ? fight.oddsFighter1 : fight.oddsFighter2;
      const aiOdds = rawOdds !== null ? rawOdds : -110;

      const wager = 100;
      let profit = 0;
      if (isCorrect) {
        if (aiOdds > 0) {
          profit = aiOdds; // e.g., +150 odds → $150 profit
        } else if (aiOdds < 0) {
          profit = (100 / Math.abs(aiOdds)) * 100; // e.g., -200 odds → $50 profit
        } else {
          profit = 0;
        }
      } else {
        profit = -100;
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
        profit, // net profit on $100 bet
        odds: aiOdds,
      };
    }).filter(Boolean) as {
      fightId: string; eventId: string; eventName: string; eventDate: Date;
      fighter1Name: string; fighter2Name: string; aiPickedFighter: string;
      actualWinner: string; isCorrect: boolean; confidence: number;
      isHighConfidence: boolean; profit: number; odds: number;
    }[];

    // ── Helper: compute aggregate stats ──────────────────────────────────
    const computeStats = (picks: typeof gradedPicks) => {
      if (picks.length === 0) {
        return {
          total: 0, correct: 0, accuracy: 0, totalProfit: 0, roi: 0, eventsGraded: 0, timeline: [],
        };
      }

      const eventIds = new Set(picks.map((p) => p.eventId));
      let cumBankroll = 1000; // Start with $1000 virtual bankroll
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

      // Group by event for charting
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
        const evtProfit = evt.picks.reduce((s, p) => s + p.profit, 0);
        const evtWager = evt.picks.reduce((s, p) => s + (p.odds !== null ? 100 : 0), 0);
        
        const rawROI = evtWager > 0 ? (evtProfit / evtWager) * 100 : 0;
        const evtROI = isNaN(rawROI) || rawROI === null ? 0 : rawROI;

        cumBankroll += evtProfit;
        if (isNaN(cumBankroll) || cumBankroll === null) {
          cumBankroll = 1000;
        }

        totalCorrectSoFar += evtCorrect;
        totalPicksSoFar += picksCount;

        const rawRollingWinRate = totalPicksSoFar > 0 ? (totalCorrectSoFar / totalPicksSoFar) * 100 : 0;
        const rollingWinRate = isNaN(rawRollingWinRate) || rawRollingWinRate === null ? 0 : rawRollingWinRate;

        const eventName = evt.eventName ? evt.eventName.split(":")[0].trim() : "Unknown Event";
        const dateStr = evt.date ? (evt.date instanceof Date ? evt.date.toISOString().split("T")[0] : new Date(evt.date).toISOString().split("T")[0]) : "";

        timeline.push({
          eventId: evt.picks[0]?.eventId || "",
          eventName,
          date: dateStr,
          correct: isNaN(evtCorrect) || evtCorrect === null ? 0 : evtCorrect,
          total: isNaN(picksCount) || picksCount === null ? 0 : picksCount,
          roi: isNaN(evtROI) ? 0 : parseFloat(evtROI.toFixed(1)),
          cumulativeBankroll: isNaN(cumBankroll) ? 1000 : parseFloat(cumBankroll.toFixed(2)),
          rollingWinRate: isNaN(rollingWinRate) ? 0 : parseFloat(rollingWinRate.toFixed(1)),
          picks: evt.picks
        });
      });

      const totalCorrect = picks.filter((p) => p.isCorrect).length;
      const totalProfit = picks.reduce((s, p) => s + p.profit, 0);
      const totalWager = picks.reduce((s, p) => s + (p.odds !== null ? 100 : 0), 0);
      
      const rawOverallROI = totalWager > 0 ? (totalProfit / totalWager) * 100 : 0;
      const safeOverallROI = isNaN(rawOverallROI) || rawOverallROI === null ? 0 : rawOverallROI;
      
      const rawAccuracy = picks.length > 0 ? (totalCorrect / picks.length) * 100 : 0;
      const safeAccuracy = isNaN(rawAccuracy) || rawAccuracy === null ? 0 : rawAccuracy;

      const safeTotalProfit = isNaN(totalProfit) || totalProfit === null ? 0 : totalProfit;

      return {
        total: picks.length,
        correct: totalCorrect,
        accuracy: parseFloat(safeAccuracy.toFixed(1)) || 0,
        totalProfit: parseFloat(safeTotalProfit.toFixed(2)) || 0,
        roi: parseFloat(safeOverallROI.toFixed(1)) || 0,
        eventsGraded: eventIds.size,
        timeline,
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
