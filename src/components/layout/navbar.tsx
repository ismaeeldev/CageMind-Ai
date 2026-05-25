import Link from "next/link"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { AuthNav } from "@/components/auth-nav"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight text-primary">
              Octagon AI
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-6">
            <Link
              href="/events"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Events
            </Link>
            <Link
              href="/fighters"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Fighters
            </Link>
            <Link
              href="/pricing"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Pricing
            </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthNav />
            <Link href="/pricing">
              <Button variant="premium" className="cursor-pointer">Subscribe to Premium</Button>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
