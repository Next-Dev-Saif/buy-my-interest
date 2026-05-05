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
          className="relative bg-primary rounded-[3rem] p-12 lg:p-24 overflow-hidden shadow-2xl shadow-primary/30"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.05] rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black opacity-[0.1] rounded-full blur-[80px] -ml-24 -mb-24" />
          
          <div className="relative z-10 text-center space-y-10 max-w-4xl mx-auto">
            
            <h2 className="text-4xl lg:text-7xl font-black text-primary-foreground leading-[1.05] tracking-tight font-editorial">
              Stop searching.
              <br />
              <span className="opacity-75">Start finding.</span>
            </h2>
            
            <p className="text-xl text-primary-foreground/75 max-w-2xl mx-auto font-semibold leading-relaxed">
              Tell us what you want once. We watch the web and deliver the right
              matches directly to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Link href="/get-started" className="group px-12 py-5 rounded-2xl bg-background text-foreground font-black text-lg hover:bg-background/90 hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                 Initialize My Search <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/seller" className="px-12 py-5 rounded-2xl border border-primary-foreground/30 text-primary-foreground font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                 <Zap className="w-5 h-5" /> Partner with Us
              </Link>
            </div>
            
            <p className="text-[10px] font-black text-primary-foreground/60 uppercase tracking-[0.3em]">
              Trusted by 12,000+ Market Professionals Worldwide
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
