"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Zap, ShieldCheck, Search } from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";

const floatingImages = [
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    className: "top-20 -left-20 w-48 h-64 md:w-64 md:h-80",
    delay: 0,
    rotate: -12,
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    className: "bottom-20 -left-10 w-56 h-48 md:w-72 md:h-64",
    delay: 0.2,
    rotate: 8,
  },
  {
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
    className: "top-10 -right-20 w-52 h-72 md:w-60 md:h-80",
    delay: 0.4,
    rotate: 15,
  },
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    className: "bottom-40 -right-16 w-64 h-52 md:w-80 md:h-60",
    delay: 0.6,
    rotate: -10,
  }
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      {/* Floating Images Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
        {floatingImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotate: img.rotate }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{ 
              opacity: { duration: 1.2, delay: img.delay },
              scale: { duration: 1.2, delay: img.delay },
              y: { 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5
              }
            }}
            className={`absolute ${img.className} rounded-[2rem] overflow-hidden border border-border shadow-2xl grayscale hover:grayscale-0 transition-all duration-700`}
          >
            <Image 
              src={img.src} 
              alt="Floating Discovery Item"
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 md:space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-muted border border-border/60 shadow-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <Image 
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    alt="User" 
                    width={24} 
                    height={24} 
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              12k+ Active Discovery Agents
            </p>
          </motion.div>

          {/* Main Title */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-foreground font-editorial"
            >
              The world's inventory <br />
              <span className="text-primary italic">at your command.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed font-medium"
            >
              We monitor 500+ premium marketplaces and private sources. 
              Set your criteria once, and let our agents surface the rare and off-market matches.
            </motion.p>
          </div>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/get-started"
              className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:-translate-y-1 active:translate-y-0 transition-transform duration-150 flex items-center justify-center gap-3 shadow-md"
            >
              Start Free Discovery{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-background text-foreground font-semibold text-base hover:bg-muted transition-colors duration-150 flex items-center justify-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PlayCircle className="w-5 h-5 text-primary" />
              </div>
              How it works
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-12 border-t border-border/40"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest">Verified Listings</span>
            </div>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest">500+ Sources</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest">2hr Scan Cycle</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
