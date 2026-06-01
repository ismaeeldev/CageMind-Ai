"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Activity } from "lucide-react";
import { ParlayBuilder } from "@/components/performance/parlay-builder";
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

type PageTab = "parlay" | "backtesting";

export default function PerformancePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPremium = session?.user?.isPremium === true;

  const [fights, setFights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PageTab>("parlay");

  const [perfData, setPerfData] = useState<{
    allStats: any;
    highConfStats: any;
  } | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);

  useEffect(() => {
    if (status !== "loading" && !isPremium) {
      router.push("/pricing?reason=premium");
    }
  }, [status, isPremium, router]);

  useEffect(() => {
    if (isPremium) {
      fetchUpcomingPredictions();
    }
  }, [isPremium]);

  // Load backtesting data when switching to that tab
  useEffect(() => {
    if (activeTab === "backtesting" && isPremium && !perfData) {
      setPerfLoading(true);
      fetch("/api/performance")
        .then((res) => res.json())
        .then((data) => {
          if (data.allStats) setPerfData(data);
        })
        .catch(console.error)
        .finally(() => setPerfLoading(false));
    }
  }, [activeTab, isPremium, perfData]);

  const fetchUpcomingPredictions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/predictions");
      if (res.ok) {
        const data = await res.json();
        setFights(data.fights || []);
      }
    } catch (error) {
      console.error("Error fetching predictions for parlay builder:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#18181B] text-zinc-100 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 font-mono">Loading Performance Dashboard...</div>
      </div>
    );
  }

  if (!isPremium) return null;

  const tabs: { id: PageTab; label: string; icon: any }[] = [
    { id: "parlay", label: "Parlay Builder", icon: Layers },
    { id: "backtesting", label: "Backtesting Results", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-9 h-9 text-purple-400" />
            Performance Dashboard
          </h1>
          <p className="text-zinc-400 text-lg">
            Build custom AI parlays and track the model's graded pick history.
          </p>
        </div>

        {/* Top-level tab switcher */}
        <div className="flex gap-2 border-b border-zinc-800 pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                  isActive
                    ? "border-purple-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "parlay" && (
          <ParlayBuilder fights={fights} />
        )}

        {activeTab === "backtesting" && (
          perfLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-pulse text-zinc-500 font-mono">Loading historical data...</div>
            </div>
          ) : perfData ? (
            <PerformanceDashboard
              allStats={perfData.allStats}
              highConfStats={perfData.highConfStats}
            />
          ) : (
            <div className="flex items-center justify-center py-32">
              <div className="text-zinc-600 font-mono">Failed to load backtesting data.</div>
            </div>
          )
        )}

      </div>
    </div>
  );
}
