"use client";

import { useState, useMemo } from "react";
import { CopyPlus, TrendingUp, Sparkles, AlertCircle, X, ClipboardCheck, Copy } from "lucide-react";

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

interface ProcessedLeg {
  id: string;
  fight: Fight;
  fighterName: string;
  winProb: number;
  odds: number;
  edge: number;
  isFavored: boolean;
  isUnderdogPick: boolean;
  isFinish: boolean;
}

export function ParlayBuilder({ fights }: { fights: Fight[] }) {
  const [selectedLegIds, setSelectedLegIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

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

  const availableLegs: ProcessedLeg[] = useMemo(() => {
    return fights.map(fight => {
      if (!fight.aiPrediction || fight.aiPrediction === "LOCKED_PREMIUM") return null;
      const probs = extractProbabilities(fight.aiPrediction, fight.fighter1.name);
      if (!probs) return null;

      const isF1Favored = probs.f1Prob > probs.f2Prob;
      const fighterName = isF1Favored ? fight.fighter1.name : fight.fighter2.name;
      const winProb = isF1Favored ? probs.f1Prob : probs.f2Prob;
      const odds = isF1Favored ? fight.oddsFighter1 : fight.oddsFighter2;
      
      const impliedProb1 = calculateImpliedProb(fight.oddsFighter1);
      const impliedProb2 = calculateImpliedProb(fight.oddsFighter2);
      
      const edge = isF1Favored ? probs.f1Prob - impliedProb1 : probs.f2Prob - impliedProb2;
      
      return {
        id: fight.id,
        fight,
        fighterName,
        winProb,
        odds: odds || -110,
        edge,
        isFavored: isF1Favored,
        isUnderdogPick: odds !== null && odds > 0,
        isFinish: winProb > 55
      };
    }).filter((leg): leg is ProcessedLeg => leg !== null);
  }, [fights]);

  // AI Parlay Generators
  const loadSafeParlay = () => {
    const safeLegs = [...availableLegs]
      .filter(leg => !leg.isUnderdogPick)
      .sort((a, b) => b.winProb - a.winProb)
      .slice(0, 3)
      .map(leg => leg.id);
    setSelectedLegIds(safeLegs);
  };

  const loadValueParlay = () => {
    const valueLegs = [...availableLegs]
      .filter(leg => leg.edge > 0)
      .sort((a, b) => b.edge - a.edge)
      .slice(0, 3)
      .map(leg => leg.id);
    setSelectedLegIds(valueLegs);
  };

  const loadLongshotParlay = () => {
    const longshotLegs = [...availableLegs]
      .filter(leg => leg.isUnderdogPick)
      .sort((a, b) => b.winProb - a.winProb)
      .slice(0, 3)
      .map(leg => leg.id);
    setSelectedLegIds(longshotLegs);
  };

  const toggleLeg = (id: string) => {
    setSelectedLegIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Math for Bet Slip
  const selectedLegs = availableLegs.filter(l => selectedLegIds.includes(l.id));

  const oddsToDecimal = (american: number) => {
    if (american > 0) return (american / 100) + 1;
    if (american < 0) return (100 / Math.abs(american)) + 1;
    return 1;
  };

  const decimalToAmerican = (decimal: number) => {
    if (decimal >= 2.0) return Math.round((decimal - 1) * 100);
    return Math.round(-100 / (decimal - 1));
  };

  const combinedDecimalOdds = selectedLegs.reduce((acc, leg) => acc * oddsToDecimal(leg.odds), 1);
  const combinedAmericanOdds = selectedLegs.length > 0 ? decimalToAmerican(combinedDecimalOdds) : 0;
  
  // Combined AI Implied Probability (Product of individual probabilities)
  const combinedAiProb = selectedLegs.length > 0 
    ? selectedLegs.reduce((acc, leg) => acc * (leg.winProb / 100), 1) * 100
    : 0;

  // Combined Sportsbook Implied Probability
  const combinedSportsbookProb = selectedLegs.length > 0
    ? (1 / combinedDecimalOdds) * 100
    : 0;

  const combinedEdge = selectedLegs.length > 0 ? combinedAiProb - combinedSportsbookProb : 0;

  const copyToSportsbook = () => {
    if (selectedLegs.length === 0) return;
    const lines: string[] = [
      "🥊 CageMind AI Parlay Slip",
      "═══════════════════════════",
    ];
    selectedLegs.forEach((leg, i) => {
      const oddsStr = leg.odds > 0 ? `+${leg.odds}` : `${leg.odds}`;
      lines.push(`${i + 1}. ${leg.fighterName} (${oddsStr})`);
      lines.push(`   ${leg.fight.fighter1.name} vs ${leg.fight.fighter2.name}`);
      lines.push(`   AI Win Prob: ${leg.winProb.toFixed(1)}%`);
      lines.push("");
    });
    const combinedOddsStr = combinedAmericanOdds > 0 ? `+${combinedAmericanOdds}` : `${combinedAmericanOdds}`;
    lines.push("═══════════════════════════");
    lines.push(`Combined Odds: ${combinedOddsStr}`);
    lines.push(`AI True Prob: ${combinedAiProb.toFixed(1)}%`);
    lines.push(`Expected Value Edge: ${combinedEdge > 0 ? "+" : ""}${combinedEdge.toFixed(1)}%`);
    lines.push("");
    lines.push("Powered by CageMind AI — cagemind.ai");

    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-[1fr,400px] gap-8">
      
      {/* Left Column: Builder & Available Legs */}
      <div className="space-y-8">
        
        {/* Curated Buttons */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Curated Parlays
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={loadSafeParlay}
              className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-white tracking-wide uppercase text-sm">The Safe Play</span>
              <span className="text-xs text-zinc-500 font-mono">Top 3 Highest Prob</span>
            </button>
            <button 
              onClick={loadValueParlay}
              className="bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-bold text-white tracking-wide uppercase text-sm">The Value Play</span>
              <span className="text-xs text-zinc-500 font-mono">Top 3 Highest Edge</span>
            </button>
            <button 
              onClick={loadLongshotParlay}
              className="bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 hover:bg-orange-500/10 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <CopyPlus className="w-5 h-5" />
              </div>
              <span className="font-bold text-white tracking-wide uppercase text-sm">The Longshot</span>
              <span className="text-xs text-zinc-500 font-mono">Top 3 Underdogs</span>
            </button>
          </div>
        </div>

        {/* Custom Builder Pool */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Available Legs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableLegs.map(leg => {
              const isSelected = selectedLegIds.includes(leg.id);
              return (
                <div 
                  key={leg.id}
                  onClick={() => toggleLeg(leg.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected 
                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(210,40,40,0.15)]" 
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase mb-1">{leg.fight.event.name.split(':')[0]}</div>
                    <div className={`font-black uppercase tracking-tight text-lg ${isSelected ? "text-white" : "text-zinc-300"}`}>
                      {leg.fighterName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-lg font-bold ${isSelected ? "text-primary" : "text-white"}`}>
                      {leg.odds > 0 ? `+${leg.odds}` : leg.odds}
                    </div>
                    <div className="text-xs font-bold text-zinc-500 flex items-center gap-1 justify-end">
                      AI: {leg.winProb.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
            {availableLegs.length === 0 && (
              <div className="col-span-full py-8 text-center text-zinc-500">
                No upcoming predictions available to build a parlay.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Bet Slip */}
      <div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden sticky top-24">
          <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">AI Bet Slip</h2>
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">
              {selectedLegs.length} Legs
            </span>
          </div>

          <div className="p-0 min-h-[150px] max-h-[400px] overflow-y-auto">
            {selectedLegs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-medium">
                Select legs to build your custom AI parlay.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {selectedLegs.map(leg => (
                  <div key={leg.id} className="p-4 bg-zinc-950 hover:bg-zinc-900/50 transition-colors flex justify-between items-center group">
                    <div>
                      <div className="text-white font-black uppercase text-sm">{leg.fighterName}</div>
                      <div className="text-zinc-500 text-xs font-bold uppercase mt-0.5">{leg.fight.fighter1.name} vs {leg.fight.fighter2.name}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-mono font-bold text-sm">{leg.odds > 0 ? `+${leg.odds}` : leg.odds}</div>
                        {leg.edge > 0 && <div className="text-emerald-500 text-[10px] font-bold">+{leg.edge.toFixed(1)}% EV</div>}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLeg(leg.id); }}
                        className="text-zinc-600 hover:text-[#D22828] transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900 p-6 border-t border-zinc-800">
            <div className="flex justify-between items-end mb-4">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Combined Odds</span>
              <span className="text-3xl font-black text-white font-mono">
                {combinedAmericanOdds > 0 ? `+${combinedAmericanOdds}` : combinedAmericanOdds}
              </span>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-zinc-800/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Sportsbook Implied Prob</span>
                <span className="text-white font-mono">{combinedSportsbookProb.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">AI True Probability</span>
                <span className="text-blue-400 font-mono font-bold">{combinedAiProb.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Expected Value (Edge)</span>
                <span className={`font-mono font-bold ${combinedEdge > 0 ? "text-emerald-400" : "text-[#D22828]"}`}>
                  {combinedEdge > 0 ? "+" : ""}{combinedEdge.toFixed(1)}%
                </span>
              </div>
            </div>

            {selectedLegs.length > 0 && (
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 mt-4 text-xs font-mono text-zinc-400 leading-relaxed max-h-32 overflow-y-auto">
                {selectedLegs.map((leg, i) => (
                  <div key={leg.id}>
                    {i + 1}. {leg.fighterName} ({leg.odds > 0 ? `+${leg.odds}` : leg.odds}) — AI: {leg.winProb.toFixed(1)}%
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={copyToSportsbook}
              disabled={selectedLegs.length === 0}
              className={`w-full mt-4 flex items-center justify-center gap-2 font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-xl border text-white ${
                copied
                  ? "bg-emerald-600 border-emerald-500/50 shadow-emerald-500/20"
                  : "bg-[#D22828] hover:bg-red-700 border-red-500/50 shadow-[#D22828]/20 disabled:opacity-40 disabled:hover:bg-[#D22828]"
              }`}
            >
              {copied ? (
                <><ClipboardCheck className="w-5 h-5" /> Copied to Clipboard!</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy to Sportsbook</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
