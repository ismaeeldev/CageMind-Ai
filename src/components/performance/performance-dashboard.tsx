"use client";

import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { TrendingUp, Target, DollarSign, BarChart2, Activity, CheckCircle2, XCircle } from "lucide-react";

interface Stats {
  total: number;
  correct: number;
  accuracy: number;
  totalProfit: number;
  roi: number;
  eventsGraded: number;
  timeline: {
    eventName: string;
    date: string;
    correct: number;
    total: number;
    roi: number;
    cumulativeBankroll: number;
    rollingWinRate: number;
  }[];
}

interface PerformanceDashboardProps {
  allStats: Stats;
  highConfStats: Stats;
}

function KpiCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub?: string; icon: any; color: string;
}) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${color}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-black text-white font-mono mb-1">{value}</div>
      <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
      {sub && <div className="text-xs text-zinc-600 mt-1 font-mono">{sub}</div>}
    </div>
  );
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <Activity className="w-14 h-14 text-zinc-700 mb-4" />
    <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest mb-2">No Graded Picks Yet</h3>
    <p className="text-zinc-600 font-mono text-sm max-w-md">
      The backtesting engine is ready. Once past events are graded with AI predictions and
      recorded results, your full performance history will appear here.
    </p>
  </div>
);

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const roi = payload[0]?.value;
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs shadow-xl">
      <p className="text-zinc-300 font-bold mb-1">{label}</p>
      <p className={`font-mono font-black ${roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        ROI: {roi >= 0 ? "+" : ""}{roi}%
      </p>
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs shadow-xl">
      <p className="text-zinc-300 font-bold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="font-mono" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" && entry.name.includes("$")
            ? `$${entry.value.toFixed(0)}`
            : `${entry.value}%`}
        </p>
      ))}
    </div>
  );
};

function StatsPanel({ stats }: { stats: Stats }) {
  if (stats.total === 0) return <EmptyState />;

  const profitColor = stats.totalProfit >= 0 ? "text-emerald-400" : "text-red-400";
  const roiColor = stats.roi >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pick Accuracy"
          value={`${stats.accuracy}%`}
          sub={`${stats.correct}/${stats.total} correct`}
          icon={Target}
          color="bg-blue-500 text-blue-400"
        />
        <KpiCard
          label="Simulated ROI"
          value={`${stats.roi >= 0 ? "+" : ""}${stats.roi}%`}
          sub="flat $100/bet"
          icon={TrendingUp}
          color={stats.roi >= 0 ? "bg-emerald-500 text-emerald-400" : "bg-red-500 text-red-400"}
        />
        <KpiCard
          label="Net P/L"
          value={`${stats.totalProfit >= 0 ? "+$" : "-$"}${Math.abs(stats.totalProfit).toFixed(0)}`}
          sub="on $100 flat units"
          icon={DollarSign}
          color={stats.totalProfit >= 0 ? "bg-emerald-500 text-emerald-400" : "bg-red-500 text-red-400"}
        />
        <KpiCard
          label="Events Graded"
          value={`${stats.eventsGraded}`}
          sub={`${stats.total} total picks`}
          icon={BarChart2}
          color="bg-purple-500 text-purple-400"
        />
      </div>

      {/* Bankroll Progression Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6">
          Bankroll Progression (Starting $1,000)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={stats.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="eventName" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomLineTooltip />} />
            <ReferenceLine y={1000} stroke="#3f3f46" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="cumulativeBankroll"
              name="Bankroll $"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rolling Win Rate & Event ROI side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Rolling Win Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6">
            Rolling Win Rate
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="eventName" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomLineTooltip />} />
              <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="rollingWinRate"
                name="Win Rate %"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ fill: "#a855f7", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event-by-Event ROI */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6">
            Event-by-Event ROI
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="eventName" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomBarTooltip />} />
              <ReferenceLine y={0} stroke="#3f3f46" />
              <Bar
                dataKey="roi"
                name="ROI %"
                radius={[4, 4, 0, 0]}
                fill="#10b981"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Picks log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">
            Event Results Log
          </h3>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {stats.timeline.map((evt, i) => (
            <div key={i} className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4 px-6 py-4 hover:bg-zinc-800/20 transition-colors">
              <div>
                <div className="text-sm font-bold text-zinc-200">{evt.eventName}</div>
                <div className="text-xs text-zinc-600 font-mono">{evt.date}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Picks</div>
                <div className="font-mono font-bold text-white">{evt.correct}/{evt.total}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">ROI</div>
                <div className={`font-mono font-bold ${evt.roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {evt.roi >= 0 ? "+" : ""}{evt.roi}%
                </div>
              </div>
              <div className="flex items-center justify-center">
                {evt.correct / evt.total >= 0.5
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PerformanceDashboard({ allStats, highConfStats }: PerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "high">("all");

  const tabs = [
    { id: "all" as const, label: "All Picks", count: allStats.total },
    { id: "high" as const, label: ">60% Confidence", count: highConfStats.total },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Historical Backtesting
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            AI pick accuracy graded against real fight outcomes.
          </p>
        </div>
        {/* Sub-tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs font-mono ${activeTab === tab.id ? "text-zinc-600" : "text-zinc-600"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "all" ? (
        <StatsPanel stats={allStats} />
      ) : (
        <StatsPanel stats={highConfStats} />
      )}
    </div>
  );
}
