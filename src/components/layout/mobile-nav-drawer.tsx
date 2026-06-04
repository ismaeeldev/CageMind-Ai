"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronRight, Home, CalendarDays, Dumbbell, Trophy, Sparkles, CreditCard, LogIn, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/fighters", label: "Fighters", icon: Dumbbell },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/predictions", label: "Predictions", icon: Sparkles },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0 border border-border/50 bg-background/80 backdrop-blur-sm"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="left-auto right-0 top-0 h-[100dvh] w-[min(86vw,20rem)] translate-x-0 translate-y-0 rounded-none rounded-l-3xl border-l border-border/60 bg-background/98 p-0 shadow-2xl data-[state=open]:slide-in-from-right-4 data-[state=closed]:slide-out-to-right-4 sm:max-w-none"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-start justify-between border-b border-border/60 px-5 py-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
            <div>
              <p className="text-base font-black uppercase tracking-wide">
                CageMind <span className="text-premium">AI</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Mobile navigation</p>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="size-4" />
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
            <div className="space-y-1.5">
              {primaryLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted/60 active:bg-muted"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-border/60 bg-muted/25 p-3">
              <Link
                href={session ? "/dashboard" : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background/70"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(210,40,40,0.25)]">
                  {session ? <UserRound className="size-5" /> : <LogIn className="size-5" />}
                </span>
                <span className="flex-1">{session ? "Profile" : "Login"}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}