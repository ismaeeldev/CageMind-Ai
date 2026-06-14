import { Suspense } from "react";
import { Metadata } from "next";
import { EventsClient } from "./events-client";

export const metadata: Metadata = {
  title: "Events | CageMind AI",
  description: "Browse upcoming and past UFC events, view fight cards and results.",
};

export const revalidate = 0;

function EventsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 sm:mb-12">
          <div className="h-12 sm:h-16 w-48 bg-zinc-800/60 rounded-xl animate-pulse mb-3" />
          <div className="h-4 w-64 bg-zinc-800/40 rounded animate-pulse" />
        </div>
        <div className="h-12 w-full sm:w-64 bg-zinc-900/50 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[400px] bg-zinc-900/60 rounded-2xl animate-pulse border border-zinc-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <EventsClient />
    </Suspense>
  );
}
