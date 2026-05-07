"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import WaveCanvas from "@/components/animations/WaveCanvas";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#050808] relative overflow-hidden flex flex-col">
      {/* Canvas Waves */}
      <WaveCanvas color="#00f2ff" opacity={0.3} />

      {/* Jumbo Decorative SVGs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.svg
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] text-primary/20"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="80" />
        </motion.svg>
        
        <motion.svg
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] text-primary/30"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 0 L200 100 L100 200 L0 100 Z" />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.03, x: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute top-[20%] left-[5%] text-[20vw] font-black font-editorial select-none"
        >
          INTEREST
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.03, x: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="absolute bottom-[20%] right-[5%] text-[20vw] font-black font-editorial select-none"
        >
          HUNT
        </motion.div>
      </div>

      {/* Header with Back Button */}
      <header className="relative z-10 p-6 lg:p-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
