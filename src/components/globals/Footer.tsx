import Link from "next/link";
import { Sparkles } from "lucide-react";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/30 mt-auto">
      <Container className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">BuyMyInterests<span className="text-primary">.ai</span></span>
        </div>
        <p className="text-sm text-foreground/60 text-center md:text-left">
          &copy; {new Date().getFullYear()} BuyMyInterests.ai. All rights reserved.
        </p>
        <nav>
          <ul className="flex items-center gap-4 text-sm font-medium">
            <li>
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
