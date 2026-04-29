import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Container from "./Container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5">
      <Container className="h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">BuyMyInterests<span className="text-primary">.ai</span></span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/seller" className="text-foreground/80 hover:text-primary transition-colors">
                For Sellers
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/get-started" className="px-5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>
      </Container>
    </header>
  );
}
