"use client";

import Link from "next/link";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "@/config/pricing";
import ComingSoonLock from "@/components/globals/ComingSoonLock";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background pointer-events-none" />
      <Container className="z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-5">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
            Pricing
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.05]">
            Choose your monitoring cadence.
          </h2>
          <p className="text-lg text-secondary leading-relaxed">
            Start free, upgrade when you want faster scans and wider coverage.
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <ComingSoonLock 
            title="Premium Plans" 
            description="Our tiered subscription engine is undergoing final stress tests. Public registration for Pro and Elite tiers will open shortly."
          />
        </div>
      </Container>
    </section>
  );
}
