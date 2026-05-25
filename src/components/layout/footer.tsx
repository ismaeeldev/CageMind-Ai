import Link from "next/link"
import { Container } from "./container"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-xl tracking-tight text-primary">
                Octagon AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The premier UFC & MMA Analytics Platform. Leverage automated data, live fight odds, and AI-driven prediction models to find your betting edge.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/fighters" className="hover:text-foreground transition-colors cursor-pointer">
                  Elo Rankings
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="hover:text-foreground transition-colors cursor-pointer">
                  Prediction Models
                </Link>
              </li>
              <li>
                <Link href="/betting" className="hover:text-foreground transition-colors cursor-pointer">
                  Betting Edge
                </Link>
              </li>
              <li>
                <Link href="/matchup-lab" className="hover:text-foreground transition-colors cursor-pointer">
                  Matchup Lab
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Octagon AI. All rights reserved.</p>
          <p>
            Data sources: roster.watch, Tapology, ESPN, UFC, FanDuel.
          </p>
        </div>
      </Container>
    </footer>
  )
}
