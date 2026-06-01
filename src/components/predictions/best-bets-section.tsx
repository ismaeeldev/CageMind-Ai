import { TrendingUp, Sparkles, Activity } from "lucide-react";

interface Fight {
  id: string;
  weightClass: string | null;
  aiPrediction: string | null;
  aiConfidence: number | null;
  oddsFighter1: number | null;
  oddsFighter2: number | null;
  fighter1: { name: string; imageUrl?: string | null };
  fighter2: { name: string; imageUrl?: string | null };
  event: { name: string; date: string };
}

interface BestBetsSectionProps {
  fights: Fight[];
}

export function BestBetsSection({ fights }: BestBetsSectionProps) {
  const extractProbabilities = (summary: string, f1Name: string): { f1Prob: number, f2Prob: number } | null => {
    const match = summary.match(/(\d+\.\d+)%/);
    if (!match) return null;
    const prob = parseFloat(match[1]);

    if (summary.includes(`${f1Name} is favored`)) {
      return { f1Prob: prob, f2Prob: 100 - prob };
    } else {
      return { f1Prob: 100 - prob, f2Prob: prob };
    }
  };

  const calculateImpliedProb = (odds: number | null) => {
    if (!odds) return 50;
    if (odds < 0) return (-odds / (-odds + 100)) * 100;
    return (100 / (odds + 100)) * 100;
  };

  const bets = fights.map(fight => {
    if (!fight.aiPrediction || fight.aiPrediction === "LOCKED_PREMIUM") return null;
    
    const probs = extractProbabilities(fight.aiPrediction, fight.fighter1.name);
    if (!probs) return null;

    const isF1Favored = probs.f1Prob > probs.f2Prob;
    const aiPick = isF1Favored ? fight.fighter1 : fight.fighter2;
    const aiPickProb = isF1Favored ? probs.f1Prob : probs.f2Prob;
    const aiPickOdds = isF1Favored ? fight.oddsFighter1 : fight.oddsFighter2;
    
    const impliedProb1 = calculateImpliedProb(fight.oddsFighter1);
    const impliedProb2 = calculateImpliedProb(fight.oddsFighter2);
    
    const edgeF1 = probs.f1Prob - impliedProb1;
    const edgeF2 = probs.f2Prob - impliedProb2;
    const bestEdge = isF1Favored ? edgeF1 : edgeF2;

    return {
      fight,
      aiPick,
      aiPickProb,
      aiPickOdds,
      bestEdge
    };
  }).filter((b): b is NonNullable<typeof b> => b !== null && b.bestEdge > 0)
    .sort((a, b) => b.bestEdge - a.bestEdge)
    .slice(0, 3); // Top 3 edges

  if (bets.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-emerald-400" /> Top Edge Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bets.map((bet, idx) => (
          <div key={bet.fight.id} className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden group hover:border-emerald-500/60 transition-colors">
            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
            
            {/* Edge Badge */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 font-black text-xs px-3 py-1 rounded-bl-lg">
              +{bet.bestEdge.toFixed(1)}% EDGE
            </div>

            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              {bet.fight.event.name.split(':')[0]}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                {bet.aiPick.imageUrl && bet.aiPick.imageUrl !== "null" ? (
                  <img src={bet.aiPick.imageUrl} alt={bet.aiPick.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-zinc-500 text-sm uppercase">{bet.aiPick.name.substring(0,2)}</span>
                )}
              </div>
              <div>
                <div className="text-lg font-black text-white uppercase">{bet.aiPick.name}</div>
                <div className="text-sm font-bold text-emerald-400">To Win</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
              <div className="text-center">
                <div className="text-xs font-bold text-zinc-500 uppercase mb-1">AI Prob</div>
                <div className="text-lg font-mono font-bold text-white flex items-center gap-1">
                  <Activity className="w-4 h-4 text-blue-400" /> {bet.aiPickProb.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-zinc-500 uppercase mb-1">Odds</div>
                <div className="text-lg font-mono font-bold text-white flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-zinc-400" /> 
                  {bet.aiPickOdds ? (bet.aiPickOdds > 0 ? `+${bet.aiPickOdds}` : bet.aiPickOdds) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
