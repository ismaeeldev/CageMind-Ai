"use client";

import { PremiumLink } from "@/components/ui/premium-link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { AuthNav } from "@/components/auth-nav"
import { useSession } from "next-auth/react"
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer"
import { ChevronDown, Activity, Sparkles, CalendarDays } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isPremium = session?.user?.isPremium === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <Container className="flex h-16 items-center justify-between gap-6">
        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-premium/10 border border-premium/30 group-hover:bg-premium/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-premium">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              </svg>
            </div>
            <span className="inline-flex items-center font-black text-xl tracking-wide uppercase">
              <span className="text-foreground">CageMind</span>
              <span className="text-premium ml-1">AI</span>
            </span>
          </Link>
        </div>

        {/* Primary Desktop Navigation Section */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 mx-auto">
          <Link
            href="/events"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Events
          </Link>
          <Link
            href="/fighters"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Fighters
          </Link>
          <Link
            href="/rankings"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Rankings
          </Link>

          {/* Tools Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap">
              Tools <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-zinc-950/95 backdrop-blur-md border border-zinc-800 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top z-50">
              <div className="grid gap-1">
                <PremiumLink
                  href="/matchup"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-colors group/item"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-premium/10 border border-premium/20 text-premium group-hover/item:bg-premium/20 transition-colors shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-200 group-hover/item:text-white transition-colors">Matchup Lab</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-premium/10 border border-premium/30 text-premium">PRO</span>
                    </div>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">Simulate head-to-head fights using advanced AI ELO engines.</p>
                  </div>
                </PremiumLink>

                <PremiumLink
                  href="/predictions"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-colors group/item"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-premium/10 border border-premium/20 text-premium group-hover/item:bg-premium/20 transition-colors shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-200 group-hover/item:text-white transition-colors">Predictions</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-premium/10 border border-premium/30 text-premium">PRO</span>
                    </div>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">View AI-generated probabilities and fight predictions.</p>
                  </div>
                </PremiumLink>

                <PremiumLink
                  href="/past-events"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-colors group/item"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-premium/10 border border-premium/20 text-premium group-hover/item:bg-premium/20 transition-colors shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-200 group-hover/item:text-white transition-colors">Past Event</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-premium/10 border border-premium/30 text-premium">PRO</span>
                    </div>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">Explore historical results and performance analytics.</p>
                  </div>
                </PremiumLink>
              </div>
            </div>
          </div>

          <Link
            href="/pricing"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <nav className="hidden md:flex items-center space-x-2">
            <AuthNav />
            {isPremium ? (
              <Link href="/dashboard">
                <Button variant="premium" className="cursor-pointer">Manage Billing</Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button variant="premium" className="cursor-pointer">Subscribe to Premium</Button>
              </Link>
            )}
          </nav>
          <MobileNavDrawer key={pathname} />
        </div>
      </Container>
    </header>
  )
}
