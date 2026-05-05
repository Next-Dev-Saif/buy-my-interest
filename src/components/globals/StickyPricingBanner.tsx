"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { planById } from "@/config/pricing";

export default function StickyPricingBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pro = planById.pro;
  const elite = planById.elite;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-6"
    >
      <Link href={pro.href} className="group">
        <div className="relative w-56 p-6 rounded-2xl bg-card border border-border shadow-2xl transition-all duration-300 group-hover:-translate-x-2 group-hover:border-primary/50 group-hover:shadow-primary/10 overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <pro.icon className="w-8 h-8 text-primary" />
              <div className="text-right">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                  Priority
                </p>
                <p className="text-xl font-black text-foreground">
                  ${pro.price}<span className="text-[10px] opacity-50">/mo</span>
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                {pro.name} Tier
              </p>
              <p className="text-[10px] text-secondary font-medium leading-relaxed mt-1">
                1-hour scanning & unlimited categories.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider">
              Upgrade Now{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          {/* Subtle Accent */}
          <div className="absolute top-0 right-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <Link href={elite.href} className="group">
        <div className="relative w-56 p-6 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-300 group-hover:-translate-x-2 group-hover:shadow-primary/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <Award className="w-8 h-8 text-primary-foreground" />
              <div className="text-right">
                <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-[0.2em]">
                  Elite
                </p>
                <p className="text-xl font-black text-primary-foreground">
                  ${elite.price}<span className="text-[10px] opacity-50">/mo</span>
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-black text-primary-foreground">
                Elite Market Access
              </p>
              <p className="text-[10px] text-primary-foreground/75 font-medium leading-relaxed mt-1">
                15-Min instant alerts & concierge verification.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-primary-foreground font-bold text-[10px] uppercase tracking-wider">
              Initialize Elite{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
