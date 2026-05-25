import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <Container className="relative z-10 flex flex-col items-center text-center">
          <Badge variant="premium" className="mb-8 px-4 py-1.5 text-sm font-semibold tracking-widest uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
            SaaS Platform Now Live
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            Find Your Betting Edge with AI-Driven <span className="premium-gradient-text">MMA Analytics</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
            Octagon AI provides automated live fight odds, dynamic Elo rankings, and cutting-edge predictive models for the serious fight fan and bettor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
            <Link href="/events" className="w-full sm:w-auto">
              <Button size="lg" className="text-base px-8 h-14 w-full cursor-pointer rounded-xl">
                View Upcoming Events
              </Button>
            </Link>
            <Link href="/matchup-lab" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-base px-8 h-14 w-full cursor-pointer rounded-xl border-primary/50 text-primary hover:bg-primary/5">
                Explore Matchup Lab
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Upcoming Event Section */}
      <section id="events" className="py-20 bg-background">
        <Container>
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Featured Upcoming Event</h2>
            <p className="text-muted-foreground max-w-2xl">
              Get an exclusive look at our predictive data for the next massive pay-per-view.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Card className="glass-panel overflow-hidden border-0 p-1 rounded-2xl">
              <div className="bg-card/40 rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="destructive" className="uppercase font-bold tracking-wider animate-pulse shadow-[0_0_10px_-2px_rgba(239,68,68,0.8)]"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span>Live Odds</Badge>
                    <span className="text-sm font-medium text-muted-foreground">July 10, 2026 • Las Vegas, NV</span>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-black uppercase text-center mt-4 tracking-tighter">Makhachev vs. Tsarukyan 2</CardTitle>
                  <CardDescription className="text-center text-primary font-medium mt-1 tracking-wide">UFC 320 - Lightweight Championship</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-background/20 hover:bg-background/40 transition-colors">
                      <h3 className="font-bold text-2xl mb-1">Islam Makhachev</h3>
                      <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-semibold text-primary/80">Champion</p>
                      <div className="bg-muted/50 border border-border/50 w-full py-3 rounded-xl font-mono text-2xl font-black shadow-inner">-250</div>
                      <p className="text-xs text-muted-foreground mt-3 font-medium">Win Probability: <span className="text-foreground">72%</span></p>
                    </div>
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-muted/5 relative min-h-[160px]">
                      <div className="hidden md:flex absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border items-center justify-center text-sm font-black z-10 text-muted-foreground shadow-lg">VS</div>
                      <div className="hidden md:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border items-center justify-center text-sm font-black z-10 text-muted-foreground shadow-lg">VS</div>
                      <Badge variant="outline" className="mb-8 border-white/10 bg-black/20">5 Rounds</Badge>
                      <div className="space-y-2 w-full mt-auto">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">AI Edge</p>
                        <div className="bg-primary/20 text-primary py-2 rounded-lg text-sm font-black border border-primary/30 shadow-[0_0_15px_-3px_rgba(210,40,40,0.2)]">
                          Over 2.5 Rounds
                        </div>
                      </div>
                    </div>
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-background/20 hover:bg-background/40 transition-colors">
                      <h3 className="font-bold text-2xl mb-1">Arman Tsarukyan</h3>
                      <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Challenger</p>
                      <div className="bg-muted/50 border border-border/50 w-full py-3 rounded-xl font-mono text-2xl font-black shadow-inner">+190</div>
                      <p className="text-xs text-muted-foreground mt-3 font-medium">Win Probability: <span className="text-foreground">28%</span></p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    Odds syncing live from FanDuel
                  </p>
                  <Link href="/pricing" className="w-full md:w-auto">
                    <Button variant="premium" size="default" className="w-full cursor-pointer rounded-xl">Unlock Full Card Predictions</Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl">
              Everything you need to analyze the UFC roster. Free tier includes rankings and historical data, while Premium unlocks predictive analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col group/feature">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover/feature:scale-110 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <CardTitle className="text-xl">Elo Rankings DB</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed">Access our comprehensive database of every active UFC fighter, automatically updated with proprietary Elo ratings after every event.</p>
              </CardContent>
              <CardFooter>
                <Badge variant="secondary" className="w-full justify-center py-1.5 rounded-lg font-bold tracking-wider uppercase text-[10px]">Free Tier</Badge>
              </CardFooter>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-premium/20 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col border-premium/30 relative overflow-hidden group/feature">
              <div className="absolute top-0 right-0 bg-premium text-premium-foreground text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-[0_0_10px_rgba(202,138,4,0.5)]">Premium</div>
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-premium/10 flex items-center justify-center mb-6 group-hover/feature:scale-110 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-premium"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <CardTitle className="text-xl">Matchup Lab</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed">An interactive comparison tool to pit any two fighters against each other. Simulates striking and grappling metrics to find stylistic advantages.</p>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button variant="premium" className="w-full cursor-pointer rounded-xl h-10">Unlock Feature</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-premium/20 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col border-premium/30 relative overflow-hidden group/feature">
              <div className="absolute top-0 right-0 bg-premium text-premium-foreground text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-[0_0_10px_rgba(202,138,4,0.5)]">Premium</div>
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-premium/10 flex items-center justify-center mb-6 group-hover/feature:scale-110 group-hover/feature:rotate-12 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-premium"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                </div>
                <CardTitle className="text-xl">AI Betting Edge</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed">Full visibility of AI-driven prediction picks across all upcoming fights, directly factoring in FanDuel odds to pinpoint value bets.</p>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button variant="premium" className="w-full cursor-pointer rounded-xl h-10">Unlock Feature</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}
