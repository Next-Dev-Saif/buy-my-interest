"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import Container from "./Container";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    const html = document.documentElement;
    if (isOpen) {
      html.style.overflow = "hidden";
      html.style.paddingRight = "var(--removed-body-scroll-bar-size, 0px)";
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore-interests/test@example.com" }, // Placeholder email for now
    { name: "Pricing", href: "/#pricing" },
    { name: "For Sellers", href: "/seller" },
  ];

  return (
    <header 
      className={`${
        isOpen ? "fixed inset-x-0 top-0 bg-background border-b border-border/60" : "sticky top-0 glass border-b border-border/40"
      } z-[100] w-full transition-all duration-300`}
    >
      <Container className="h-20 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="py-2 active:scale-95 transition-transform">
            <Logo className="w-10 h-10 sm:w-11 sm:h-11" />
          </Link>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.1em]">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Link
            href="/get-started"
            className="hidden sm:flex px-7 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl bg-foreground text-background hover:opacity-90 transition-all shadow-lg shadow-black/5 active:scale-95"
          >
            Get Started
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-muted/40 border border-border/60 text-foreground active:scale-90 transition-all"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 top-20 z-[90] lg:hidden">
            {/* Immediate Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-background"
            />
            
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative h-full flex flex-col p-8 pt-12 gap-10 overflow-y-auto no-scrollbar"
            >
              <ul className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-4xl font-black text-foreground font-editorial tracking-tight active:text-primary transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-auto pb-20 space-y-6"
              >
                <div className="h-px bg-border/60" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/get-started"
                  className="w-full py-5 flex items-center justify-center rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-foreground/10 active:scale-[0.98] transition-all"
                >
                  Get Started Now
                </Link>
              </motion.div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
