"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-32 relative overflow-hidden">
      <Container>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-primary rounded-[2.5rem] md:rounded-[3rem] px-6 py-12 md:p-12 lg:p-24 overflow-hidden shadow-2xl shadow-primary/30"
        >
          
          <div className="relative z-10 text-center space-y-8 md:space-y-10 max-w-4xl mx-auto">
            
            <h2 className="text-4xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.05] tracking-tight">
              Stop searching.
              <br />
              <span className="opacity-75">Start finding.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto font-semibold leading-relaxed">
              Tell us what you want once. We watch the web and deliver the right
              matches directly to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 md:pt-6">
              <Link href="/get-started" className="group w-full sm:w-auto px-8 md:px-10 py-4 rounded-xl bg-background text-foreground font-semibold text-base hover:bg-muted hover:shadow-md transition-all flex items-center justify-center gap-3">
                 Initialize My Search <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/seller" className="w-full sm:w-auto px-8 md:px-10 py-4 rounded-xl border border-primary-foreground/30 text-primary-foreground font-semibold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 <Zap className="w-5 h-5" /> Partner with Us
              </Link>
            </div>
            
            <p className="text-[10px] font-black text-primary-foreground/60 uppercase tracking-[0.3em] px-4">
              Trusted by 12,000+ Market Professionals Worldwide
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
