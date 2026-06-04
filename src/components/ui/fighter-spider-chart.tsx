"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface FighterStats {
  name: string;
  wins?: number | null;
  losses?: number | null;
  koWins?: number | null;
  subWins?: number | null;
  eloRating?: number | null;
  reach?: number | null;
  age?: number | null;
  // Optional advanced stats if ever added
  slpm?: number | null;
  strAcc?: number | null;
  td15m?: number | null;
  tdAcc?: number | null;
  sub15m?: number | null;
}

interface FighterSpiderChartProps {
  fighter1: FighterStats;
  fighter2: FighterStats;
}

export function FighterSpiderChart({ fighter1, fighter2 }: FighterSpiderChartProps) {
  const norm = (val: number | null | undefined, max: number) => {
    if (!val) return 0;
    return Math.min(100, Math.max(0, (val / max) * 100));
  };

  // Derive "Finishing Power" from KO wins %
  const finishRate = (f: FighterStats) => {
    const total = (f.wins || 0);
    if (total === 0) return 0;
    return ((f.koWins || 0) / total) * 100;
  };

  // Derive "Submission Threat" from sub wins %
  const subRate = (f: FighterStats) => {
    const total = (f.wins || 0);
    if (total === 0) return 0;
    return ((f.subWins || 0) / total) * 100;
  };

  // Win percentage
  const winPct = (f: FighterStats) => {
    const total = (f.wins || 0) + (f.losses || 0);
    if (total === 0) return 50;
    return ((f.wins || 0) / total) * 100;
  };

  // Use advanced stats if present, otherwise derive from basic stats
  const data = [
    {
      subject: "Win Rate",
      f1: winPct(fighter1),
      f2: winPct(fighter2),
      fullMark: 100,
      f1Label: `${winPct(fighter1).toFixed(0)}%`,
      f2Label: `${winPct(fighter2).toFixed(0)}%`,
    },
    {
      subject: "Elo Rating",
      f1: norm(fighter1.eloRating, 2200),
      f2: norm(fighter2.eloRating, 2200),
      fullMark: 100,
      f1Label: `${fighter1.eloRating || 1500}`,
      f2Label: `${fighter2.eloRating || 1500}`,
    },
    {
      subject: "KO Power",
      f1: fighter1.slpm != null ? norm(fighter1.slpm, 8) : finishRate(fighter1),
      f2: fighter2.slpm != null ? norm(fighter2.slpm, 8) : finishRate(fighter2),
      fullMark: 100,
      f1Label: fighter1.slpm != null ? `${fighter1.slpm} sl/m` : `${finishRate(fighter1).toFixed(0)}% KO rate`,
      f2Label: fighter2.slpm != null ? `${fighter2.slpm} sl/m` : `${finishRate(fighter2).toFixed(0)}% KO rate`,
    },
    {
      subject: "Submission",
      f1: fighter1.sub15m != null ? norm(fighter1.sub15m, 3) : subRate(fighter1),
      f2: fighter2.sub15m != null ? norm(fighter2.sub15m, 3) : subRate(fighter2),
      fullMark: 100,
      f1Label: fighter1.sub15m != null ? `${fighter1.sub15m} sub/15m` : `${subRate(fighter1).toFixed(0)}% sub rate`,
      f2Label: fighter2.sub15m != null ? `${fighter2.sub15m} sub/15m` : `${subRate(fighter2).toFixed(0)}% sub rate`,
    },
    {
      subject: "Experience",
      f1: norm((fighter1.wins || 0) + (fighter1.losses || 0), 30),
      f2: norm((fighter2.wins || 0) + (fighter2.losses || 0), 30),
      fullMark: 100,
      f1Label: `${(fighter1.wins || 0) + (fighter1.losses || 0)} fights`,
      f2Label: `${(fighter2.wins || 0) + (fighter2.losses || 0)} fights`,
    },
    {
      subject: "Reach",
      f1: norm(fighter1.reach, 90),
      f2: norm(fighter2.reach, 90),
      fullMark: 100,
      f1Label: fighter1.reach ? `${fighter1.reach}"` : "N/A",
      f2Label: fighter2.reach ? `${fighter2.reach}"` : "N/A",
    },
  ];

  // Check if ALL values are zero — show a message instead of a blank chart
  const hasData = data.some(d => d.f1 > 0 || d.f2 > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-zinc-400 mb-2 font-bold uppercase tracking-widest">{d.subject}</p>
          <div className="flex justify-between items-center gap-4 mb-1">
            <span className="text-blue-400 font-bold truncate max-w-[100px]">{fighter1.name}</span>
            <span className="text-white font-black">{d.f1Label}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-orange-400 font-bold truncate max-w-[100px]">{fighter2.name}</span>
            <span className="text-white font-black">{d.f2Label}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-600 text-sm font-mono text-center">
        No statistical data available for this matchup yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-3 text-xs font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-blue-400">{fighter1.name.split(" ").pop()}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
          <span className="text-orange-400">{fighter2.name.split(" ").pop()}</span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name={fighter1.name}
            dataKey="f1"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.2}
            dot={{ fill: '#3b82f6', r: 3 }}
          />
          <Radar
            name={fighter2.name}
            dataKey="f2"
            stroke="#f97316"
            strokeWidth={2}
            fill="#f97316"
            fillOpacity={0.2}
            dot={{ fill: '#f97316', r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}


