import Link from "next/link";
import { Logo } from "./Logo";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/30 mt-auto pb-32 sm:pb-0">
      <Container className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/">
          <Logo className="w-10 h-10" />
        </Link>
        <p className="text-sm text-secondary text-center md:text-left">
          &copy; {new Date().getFullYear()} BuyMyInterests. All rights reserved.
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
