"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { EventCard } from "@/components/events/event-card";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

type Tab = "upcoming" | "past";

function EventCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/60 h-[400px] animate-pulse flex flex-col">
      <div className="p-4 md:p-5 pb-2 flex justify-between items-start">
        <div className="h-5 bg-zinc-800 rounded w-2/3" />
        <div className="h-5 bg-zinc-800 rounded w-14" />
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-[120px] w-[90px] bg-zinc-800 rounded-lg" />
          <div className="h-3 w-16 bg-zinc-800 rounded" />
        </div>
        <div className="h-8 w-8 bg-zinc-800 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-[120px] w-[90px] bg-zinc-800 rounded-lg" />
          <div className="h-3 w-16 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="shrink-0 p-4 md:p-5 pt-3 border-t border-zinc-800/40 flex flex-col gap-2">
        <div className="flex justify-between"><div className="h-3 w-8 bg-zinc-800 rounded" /><div className="h-3 w-24 bg-zinc-800 rounded" /></div>
        <div className="flex justify-between"><div className="h-3 w-10 bg-zinc-800 rounded" /><div className="h-3 w-20 bg-zinc-800 rounded" /></div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onNavigate,
}: {
  page: number;
  totalPages: number;
  onNavigate: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => onNavigate(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 h-10 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Mobile: just show current / total */}
      <span className="sm:hidden px-4 h-10 flex items-center text-sm font-medium text-zinc-300">
        {page} / {totalPages}
      </span>

      {/* Desktop: full page buttons */}
      <div className="hidden sm:flex items-center gap-1">
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-zinc-600 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onNavigate(p as number)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
                p === page
                  ? "bg-[#D22828] text-white shadow-[0_0_12px_-2px_rgba(210,40,40,0.5)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onNavigate(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 h-10 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function EventsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as Tab) || "upcoming";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [events, setEvents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?tab=${tab}&page=${page}`);
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data.events);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchEvents();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchEvents]);

  const navigate = (newTab: Tab, newPage: number) => {
    const params = new URLSearchParams();
    params.set("tab", newTab);
    if (newPage > 1) params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-3 premium-gradient-text uppercase leading-none">
            Events
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Browse upcoming fight cards and past results.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 bg-zinc-900/50 p-1 rounded-xl w-full sm:w-auto sm:inline-flex border border-zinc-800/60">
          <button
            onClick={() => navigate("upcoming", 1)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
              tab === "upcoming"
                ? "bg-[#D22828] text-white shadow-[0_0_16px_-4px_rgba(210,40,40,0.6)]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className={`relative flex h-2 w-2 ${tab === "upcoming" ? "opacity-100" : "opacity-0"}`}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Upcoming
          </button>
          <button
            onClick={() => navigate("past", 1)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
              tab === "past"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Past
          </button>
        </div>

        {/* Count */}
        {!loading && total > 0 && (
          <p className="text-xs text-zinc-500 mb-4 sm:mb-6 font-mono">
            {total} event{total !== 1 ? "s" : ""}{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
            <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-lg font-bold text-zinc-400">
              {tab === "upcoming" ? "No upcoming events scheduled" : "No past events found"}
            </p>
            <p className="text-sm text-zinc-600 mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onNavigate={(p) => navigate(tab, p)}
          />
        )}

      </div>
    </div>
  );
}
