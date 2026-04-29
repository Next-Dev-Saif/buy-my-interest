"use client";

import { motion } from "framer-motion";
import { Zap, ChevronRight, Crown, Shield } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function StickyPricingBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-4"
    >
      <Link href="/checkout/vanguard" className="group">
        <div className="relative w-56 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl transition-all hover:-translate-x-4 hover:scale-105 border border-purple-500/30">
          <Image src="/images/feature_ai.png" alt="Vanguard" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 gap-4">
             <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 backdrop-blur-md">
                <Shield className="w-5 h-5 text-purple-300" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">Priority</p>
                <p className="text-sm font-bold text-white">Go Vanguard</p>
             </div>
          </div>
        </div>
      </Link>

      <Link href="/checkout/apex" className="group">
        <div className="relative w-56 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl transition-all hover:-translate-x-4 hover:scale-105 border border-indigo-500/30">
          <Image src="/images/feature_dashboard.png" alt="Apex" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 backdrop-blur-md">
                <Crown className="w-5 h-5 text-indigo-300" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Elite</p>
                <p className="text-sm font-bold text-white">Go Apex</p>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
