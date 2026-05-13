"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Hexagon } from "lucide-react";

const Orb = () => (
  <div className="relative w-32 h-32 mx-auto mb-8">
    <motion.div 
      animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
    />
    <div className="absolute inset-2 rounded-full bg-background border border-primary/20 shadow-inner flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative z-10"
      >
        <Hexagon className="w-12 h-12 text-primary opacity-40" strokeWidth={1} />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),1)]" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),1)]" />
      </div>
    </div>
  </div>
);

export default function ComingSoonLock({ title = "Coming Soon", description = "We're currently fine-tuning our Discovery Engine. This feature will be available shortly." }: { title?: string, description?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto text-center p-12 glass rounded-[3rem] border border-border/40 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <Orb />
      
      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          <Lock className="w-3 h-3" /> Dropping Soon
        </div>
        
        <h2 className="text-4xl font-black text-foreground font-editorial tracking-tight">{title}</h2>
        
        <p className="text-secondary text-lg leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </motion.button>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Feature In Development
          </div>
        </div>
      </div>
    </motion.div>
  );
}
