import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { EventFightsSection } from "@/components/events/event-fights-section";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Lock, Zap, TrendingUp, BrainCircuit } from "lucide-react";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isPremium = session?.user?.isPremium === true;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      fights: {
        take: 1,
        orderBy: { createdAt: "asc" },
        include: { fighter1: true, fighter2: true }
      }
    }
  });

  if (!event) notFound();

  const mainEvent = event.fights[0];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-16 max-w-5xl mx-auto">

      {/* Event Header — always visible */}
      <div className="mb-12 text-center md:text-left">
        <Badge variant={event.isUpcoming ? "default" : "secondary"} className="mb-4">
          {event.isUpcoming ? "Upcoming Event" : "Past Event"}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 premium-gradient-text text-white">
          {event.name}
        </h1>
        <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 text-muted-foreground text-lg">
          <span className="flex items-center gap-2">
            📅 {format(new Date(event.date), "MMMM do, yyyy")}
          </span>
          <span className="hidden md:inline text-zinc-700">•</span>
          <span className="flex items-center gap-2">
            📍 {event.location || "TBD"}
          </span>
        </div>
      </div>

      {/* Conditional Content */}
      {isPremium ? (
        // PREMIUM — Full fight card
        <div className="space-y-16">
          <EventFightsSection eventId={event.id} isUpcoming={event.isUpcoming} />
        </div>
      ) : (
        // FREE — Teaser + Paywall
        <div className="space-y-8">

          {/* Main event teaser (free) */}
          {mainEvent && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Main Event</p>
              <div className="flex items-center justify-center gap-6 md:gap-12">
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                    {mainEvent.fighter1.name}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    {mainEvent.fighter1.wins}-{mainEvent.fighter1.losses}-{mainEvent.fighter1.draws}
                  </p>
                </div>
                <div className="text-zinc-600 font-black text-xl uppercase tracking-widest px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950">
                  VS
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                    {mainEvent.fighter2.name}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    {mainEvent.fighter2.wins}-{mainEvent.fighter2.losses}-{mainEvent.fighter2.draws}
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-zinc-600 uppercase tracking-widest font-bold mt-4">
                {mainEvent.weightClass || "Catchweight"}
                {mainEvent.isTitleFight && " · 🏆 Title Bout"}
              </p>
            </div>
          )}

          {/* Paywall gate */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
            {/* Blurred fake content behind the gate */}
            <div className="blur-sm pointer-events-none select-none p-6 space-y-4 opacity-40">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center px-6 gap-4">
                  <div className="h-6 w-40 bg-zinc-700 rounded" />
                  <div className="h-6 w-12 bg-zinc-800 rounded mx-auto" />
                  <div className="h-6 w-40 bg-zinc-700 rounded" />
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 animate-pulse">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                Full Card Locked
              </h2>
              <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
                Subscribe to Premium to unlock the full fight card, AI predictions, betting edge finder, and fighter analytics for every bout.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { icon: BrainCircuit, label: "AI Fight Predictions" },
                  { icon: TrendingUp, label: "Betting Edge Finder" },
                  { icon: Zap, label: "Full Fight Card" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full">
                    <Icon className="w-3.5 h-3.5 text-primary" /> {label}
                  </span>
                ))}
              </div>

              <Link
                href="/pricing"
                className="bg-primary hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-primary/25 hover:scale-105 active:scale-95"
              >
                Unlock Premium — View Full Card
              </Link>

              {session ? null : (
                <p className="text-zinc-600 text-xs mt-4">
                  Already a member?{" "}
                  <Link href="/auth/login" className="text-zinc-400 underline hover:text-white">Sign in</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

