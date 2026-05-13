"use client";

import { motion } from "framer-motion";
import Container from "@/components/globals/Container";
import Image from "next/image";
import { Database, Search, Cpu, Share2 } from "lucide-react";

const stats = [
  { label: "Data Sources", value: "500+", icon: Database },
  { label: "Daily Scans", value: "12,000+", icon: Search },
  { label: "Direct Sellers", value: "2.4k", icon: Share2 },
  { label: "Scan Velocity", value: "2hrs", icon: Cpu },
];

export default function MarketIntelligence() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8 md:space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">
                Market Core
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground font-editorial tracking-tight leading-[1.1]">
                Global coverage. <br />
                <span className="text-secondary/40 italic">Local precision.</span>
              </h2>
            </div>
            
            <p className="text-lg text-secondary font-medium leading-relaxed max-w-xl">
              We don't just search the web; we monitor the pulse of the global marketplace. 
              Our engine aggregates data from over 500 premium sources—including niche forums, private groups, and specialized listing sites—ensuring you never miss a rare find.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3 text-primary">
                    <stat.icon className="w-5 h-5" />
                    <span className="text-2xl font-black text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop" 
                alt="Modern workspace with data analysis"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating Intelligence Card */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute bottom-8 right-8 left-8 glass p-6 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Market Intelligence</p>
                    <p className="text-xs font-bold text-foreground">Active Analysis</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Background decorative element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-muted rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </Container>
    </section>
  );
}
