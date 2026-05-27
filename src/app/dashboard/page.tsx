import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Activity, Settings, Zap, History } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  });

  const isPremium = subscription?.status === "active" && subscription?.currentPeriodEnd && subscription.currentPeriodEnd.getTime() > Date.now();

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="relative w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pt-16 pb-12 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <Container className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">Welcome back, </span>
                <span className="text-premium">{session.user.name?.split(" ")[0] || "Fighter"}</span>
              </h1>
              <p className="text-muted-foreground text-lg">Manage your Octagon AI account and predictions.</p>
            </div>
            <div className="flex items-center gap-4">
              {isPremium ? (
                <Badge variant="premium" className="px-4 py-1.5 shadow-lg">
                  Premium Active
                </Badge>
              ) : (
                <Link href="/pricing">
                  <Button variant="premium" className="px-4 py-1.5 shadow-[0_0_15px_-3px_rgba(202,138,4,0.5)]">
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
              <Link href="/settings/billing">
                <Button variant="secondary" className="gap-2">
                  <Settings className="w-4 h-4" /> Account Settings
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <Card className="glass-panel border-border/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Activity className="w-32 h-32" />
              </div>
              <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
                <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(210,40,40,0.6)]"></span>
                  My Predictions Activity
                </CardTitle>
                <CardDescription>Your recent betting picks and AI unlocks.</CardDescription>
              </CardHeader>
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <History className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Active Picks</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  You haven't tracked or unlocked any AI predictions for upcoming fight cards yet.
                </p>
                <Link href="/predictions">
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                    Browse Upcoming Fights
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <Card className="glass-panel border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Platform Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/predictions" className="block group">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">AI Betting Edge</h4>
                      <p className="text-xs text-muted-foreground">View predictive models</p>
                    </div>
                  </div>
                </Link>
                <Link href="/matchup" className="block group">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-premium/10 flex items-center justify-center group-hover:bg-premium/20 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-premium">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Matchup Lab</h4>
                      <p className="text-xs text-muted-foreground">Compare any two fighters</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/5">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Email Address</p>
                  <p className="text-sm font-medium">{session.user.email}</p>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <Link href="/settings/billing">
                    <Button variant="secondary" className="w-full justify-between group">
                      Manage Billing
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </Container>
    </div>
  );
}
