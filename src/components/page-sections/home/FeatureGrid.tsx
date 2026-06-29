"use client";

import {
  BarChart3,
  Globe,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeatureGrid() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/25 pointer-events-none" />
      <Container className="relative z-10">
        <div className="relative text-center max-w-2xl mx-auto mb-20 space-y-5">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
            Capabilities
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Quietly powerful.
          </h2>
          <p className="text-lg text-secondary font-semibold leading-relaxed">
            Deep monitoring and clean delivery, designed to feel effortless.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-1 glass rounded-[2rem] sm:rounded-[2.5rem] border border-border/70 p-8 sm:p-10 flex flex-col lg:flex-row gap-8 sm:gap-10 overflow-hidden group shadow-sm hover:shadow-2xl transition-all relative"
          >
            <div className="flex-1 space-y-5 sm:space-y-6 relative z-10 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-primary mx-auto sm:mx-0">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Broad coverage, precise intent.
              </h3>
              <p className="text-secondary leading-relaxed font-semibold text-sm sm:text-base">
                Beyond the obvious marketplaces: niche forums, smaller listings,
                and specialty inventory that never trends publicly.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2 sm:pt-4">
                <div className="px-4 py-2 rounded-xl bg-background/50 border border-border/70 text-[10px] sm:text-xs font-bold">
                  500+ Sources
                </div>
                <div className="px-4 py-2 rounded-xl bg-background/50 border border-border/70 text-[10px] sm:text-xs font-bold">
                  Global Reach
                </div>
              </div>
            </div>
            <div className="flex-1 relative min-h-[220px] sm:min-h-[250px] lg:min-h-0 -mx-8 -mb-8 sm:mx-0 sm:mb-0">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Real Estate Discovery"
                fill
                className="object-cover rounded-none sm:rounded-2xl group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-1 bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 text-primary-foreground flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-primary/20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
            <div className="space-y-4 relative z-10 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-primary-foreground mx-auto sm:mx-0">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Real-time pulse.</h3>
              <p className="text-primary-foreground/80 font-semibold text-sm sm:text-base">
                Matches are detected and delivered to your inbox within minutes
                of being posted online.
              </p>
            </div>
            <div className="pt-10 flex items-end justify-between relative z-10">
              <span className="text-3xl sm:text-4xl font-black">2hr</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">
                Scan Cycle
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 glass rounded-[2rem] sm:rounded-[2.5rem] border border-border/70 p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-primary mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Concierge Check
              </h3>
              <p className="text-secondary font-semibold text-sm sm:text-base">
                Verified listings are highlighted using our hybrid protocol for maximum safety.
              </p>
            </div>
            <div className="pt-8">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-4/5" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">
                  Accuracy Rating
                </p>
                <p className="text-[10px] font-black text-primary uppercase">98%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 md:row-span-1 glass rounded-[2rem] sm:rounded-[2.5rem] border border-border/70 p-8 sm:p-10 flex flex-col lg:flex-row-reverse gap-8 sm:gap-10 overflow-hidden group shadow-sm hover:shadow-2xl transition-all relative"
          >
            <div className="flex-1 space-y-5 sm:space-y-6 relative z-10 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-primary mx-auto sm:mx-0">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Built for decisions.
              </h3>
              <p className="text-secondary leading-relaxed font-semibold text-sm sm:text-base">
                A dedicated dashboard to track price history, compare multiple
                listings, and manage automated alerts.
              </p>
              <button className="flex items-center justify-center sm:justify-start gap-2 text-primary font-bold hover:underline underline-offset-4 text-sm sm:text-base">
                View Dashboard Specs <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative min-h-[220px] sm:min-h-[250px] lg:min-h-0 -mx-8 -mb-8 sm:mx-0 sm:mb-0">
              <Image
                src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1200&auto=format&fit=crop"
                alt="Intelligence Insights Dashboard"
                fill
                className="object-cover rounded-none sm:rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
