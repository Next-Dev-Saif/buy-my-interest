"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Zap } from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[620px] w-[980px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -bottom-56 -left-40 h-[680px] w-[680px] rounded-full bg-accent/70 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          <div className="flex-1 space-y-9 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/70 bg-background/50 backdrop-blur"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-secondary">
                Deal Intelligence
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-5xl lg:text-7xl font-black tracking-tight leading-[0.98] text-foreground font-editorial"
            >
              Stop searching.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-300">
                Start finding.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold"
            >
              Set your criteria once. Our search agents monitor hundreds of sources
              and surface the best matches before they get buried.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/get-started"
                className="group px-9 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-primary/20"
              >
                Start Free Search{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-9 py-5 rounded-2xl border border-border/80 bg-background/50 text-foreground font-bold text-lg hover:bg-muted/40 transition-all flex items-center justify-center gap-3 backdrop-blur">
                <PlayCircle className="w-5 h-5 text-primary" /> Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.46 }}
              className="grid grid-cols-3 gap-3 pt-8"
            >
              {[
                { value: "500+", label: "Sources" },
                { value: "12k+", label: "Searchers" },
                { value: "2hr", label: "Scan Cycle" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl border border-border/70 px-4 py-4 text-left">
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.22em] mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex-1 w-full relative"
          >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-border/70 shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1592193333411-29788ef33993?q=80&w=1600&auto=format&fit=crop" 
                    alt="Premium Automotive Discovery" 
                    width={1000} 
                    height={1000}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-8 -left-8 hidden xl:block"
                  >
                    <div className="glass px-4 py-3 rounded-2xl border border-border/70 shadow-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center text-primary">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="pr-3">
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                            New Match
                          </p>
                          <p className="text-xs font-black text-foreground">Vintage Porsche 911</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              </div>
              
              <div className="absolute -inset-10 bg-primary/20 blur-[130px] rounded-full pointer-events-none -z-10" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
