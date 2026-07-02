"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
  }, [pathname]);

  return (
    <>
      {isLoading && (
        <motion.div
          key={pathname}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
          onAnimationComplete={() => setIsLoading(false)}
          className="fixed inset-0 z-[99999] bg-background/60 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-32 h-32 mb-8"
          >
            <Image 
              src="/images/agent-avatar.png"
              alt="Loading Splash"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(var(--primary),0.3)] animate-pulse"
            />
          </motion.div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/80">Processing...</span>
          </div>
        </motion.div>
      )}
      
      <div className="flex-grow flex flex-col w-full h-full">
        {children}
      </div>
    </>
  );
}
