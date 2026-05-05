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
      <Container>
        <div className="relative text-center max-w-2xl mx-auto mb-20 space-y-5">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
            Capabilities
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground font-editorial tracking-tight">
            Quietly powerful.
          </h2>
          <p className="text-lg text-secondary font-semibold leading-relaxed">
            Deep monitoring and clean delivery, designed to feel effortless.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[800px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-1 glass rounded-[2.5rem] border border-border/70 p-10 flex flex-col lg:flex-row gap-10 overflow-hidden group shadow-sm hover:shadow-2xl transition-all relative"
          >
            <div className="flex-1 space-y-6 relative z-10">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-foreground font-editorial tracking-tight">
                Broad coverage, precise intent.
              </h3>
              <p className="text-secondary leading-relaxed font-semibold">
                Beyond the obvious marketplaces: niche forums, smaller listings,
                and specialty inventory that never trends publicly.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="px-4 py-2 rounded-xl bg-background/50 border border-border/70 text-xs font-bold">
                  500+ Sources
                </div>
                <div className="px-4 py-2 rounded-xl bg-background/50 border border-border/70 text-xs font-bold">
                  Global Reach
                </div>
              </div>
            </div>
            <div className="flex-1 relative min-h-[250px] lg:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Real Estate Discovery"
                fill
                className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-1 bg-primary rounded-[2.5rem] p-10 text-primary-foreground flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-primary/20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 flex items-center justify-center text-primary-foreground">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black font-editorial tracking-tight">Real-time pulse.</h3>
              <p className="text-primary-foreground/80 font-semibold">
                Matches are detected and delivered to your inbox within minutes
                of being posted online.
              </p>
            </div>
            <div className="pt-10 flex items-end justify-between relative z-10">
              <span className="text-4xl font-black">2hr</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                Scan Cycle
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 glass rounded-[2.5rem] border border-border/70 p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground">
                Concierge Check
              </h3>
              <p className="text-secondary font-semibold">
                Verified listings are highlighted using our hybrid AI & human
                verification protocol for maximum safety.
              </p>
            </div>
            <div className="pt-8">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-4/5" />
              </div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-3">
                Accuracy Rating: 98%
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 md:row-span-1 glass rounded-[2.5rem] border border-border/70 p-10 flex flex-col lg:flex-row-reverse gap-10 overflow-hidden group shadow-sm hover:shadow-2xl transition-all relative"
          >
            <div className="flex-1 space-y-6 relative z-10">
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-foreground font-editorial tracking-tight">
                A dashboard built for decisions.
              </h3>
              <p className="text-secondary leading-relaxed font-semibold">
                A dedicated dashboard to track price history, compare multiple
                listings, and manage automated alerts across all categories in
                one unified view.
              </p>
              <button className="flex items-center gap-2 text-primary font-bold hover:underline underline-offset-4">
                View Dashboard Specs <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative min-h-[250px] lg:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1200&auto=format&fit=crop"
                alt="Intelligence Insights Dashboard"
                fill
                className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
