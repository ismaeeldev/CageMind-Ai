"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface FighterStats {
  name: string;
  slpm?: number | null;
  strAcc?: number | null;
  td15m?: number | null;
  tdAcc?: number | null;
  sub15m?: number | null;
  koWins?: number | null;
}

interface FighterSpiderChartProps {
  fighter1: FighterStats;
  fighter2: FighterStats;
}

export function FighterSpiderChart({ fighter1, fighter2 }: FighterSpiderChartProps) {
  const normalize = (val: number | null | undefined, max: number) => {
    if (val === null || val === undefined) return 0;
    return Math.min(100, Math.max(0, (val / max) * 100));
  };

  const data = [
    {
      subject: "Striking Vol",
      f1: normalize(fighter1.slpm, 8.0),
      f2: normalize(fighter2.slpm, 8.0),
      fullMark: 100,
      f1Raw: fighter1.slpm || 0,
      f2Raw: fighter2.slpm || 0,
    },
    {
      subject: "Striking Acc",
      f1: normalize(fighter1.strAcc, 100),
      f2: normalize(fighter2.strAcc, 100),
      fullMark: 100,
      f1Raw: fighter1.strAcc || 0,
      f2Raw: fighter2.strAcc || 0,
    },
    {
      subject: "Wrestling Vol",
      f1: normalize(fighter1.td15m, 6.0),
      f2: normalize(fighter2.td15m, 6.0),
      fullMark: 100,
      f1Raw: fighter1.td15m || 0,
      f2Raw: fighter2.td15m || 0,
    },
    {
      subject: "Takedown Acc",
      f1: normalize(fighter1.tdAcc, 100),
      f2: normalize(fighter2.tdAcc, 100),
      fullMark: 100,
      f1Raw: fighter1.tdAcc || 0,
      f2Raw: fighter2.tdAcc || 0,
    },
    {
      subject: "Jiu-Jitsu Threat",
      f1: normalize(fighter1.sub15m, 3.0),
      f2: normalize(fighter2.sub15m, 3.0),
      fullMark: 100,
      f1Raw: fighter1.sub15m || 0,
      f2Raw: fighter2.sub15m || 0,
    },
    {
      subject: "KO Power",
      f1: normalize(fighter1.koWins, 20),
      f2: normalize(fighter2.koWins, 20),
      fullMark: 100,
      f1Raw: fighter1.koWins || 0,
      f2Raw: fighter2.koWins || 0,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const subject = payload[0].payload.subject;
      const f1Raw = payload[0].payload.f1Raw;
      const f2Raw = payload[0].payload.f2Raw;
      
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-zinc-400 mb-2 font-bold uppercase tracking-widest">{subject}</p>
          <div className="flex justify-between items-center gap-4 mb-1">
            <span className="text-blue-400 font-bold truncate max-w-[100px]">{fighter1.name}</span>
            <span className="text-white font-black">{typeof f1Raw === 'number' ? f1Raw.toFixed(1) : f1Raw}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-orange-400 font-bold truncate max-w-[100px]">{fighter2.name}</span>
            <span className="text-white font-black">{typeof f2Raw === 'number' ? f2Raw.toFixed(1) : f2Raw}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Fighter 1 (Blue Corner Equivalent) */}
          <Radar
            name={fighter1.name}
            dataKey="f1"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.25}
          />
          
          {/* Fighter 2 (Red Corner Equivalent) */}
          <Radar
            name={fighter2.name}
            dataKey="f2"
            stroke="#f97316"
            strokeWidth={2}
            fill="#f97316"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
