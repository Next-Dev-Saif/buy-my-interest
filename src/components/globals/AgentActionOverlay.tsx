"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomAgentIcon } from "./CustomAgentIcon";
import { AgentAvatar } from "../page-sections/agent/AgentAvatar";

interface AgentActionOverlayProps {
  isOpen: boolean;
  actionText: string;
  onCancel: () => void;
  countdownMs?: number;
}

export function AgentActionOverlay({ isOpen, actionText, onCancel, countdownMs = 3000 }: AgentActionOverlayProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setProgress(100);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / countdownMs) * 100);
        setProgress(remaining);
        if (remaining === 0) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, countdownMs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/40 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="p-10 rounded-[3rem] bg-card border border-border/60 shadow-2xl flex flex-col items-center text-center max-w-md w-full mx-4 relative overflow-hidden"
          >
            {/* Progress Bar Background */}
            <div
              className="absolute top-0 left-0 h-1.5 bg-primary transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />

            <div className="mb-8">
              <AgentAvatar size="lg" />
            </div>

            <h3 className="text-3xl font-black text-foreground font-editorial tracking-tight mb-3">Agent is Working</h3>
            <p className="text-base font-medium text-secondary mb-10 leading-relaxed max-w-[250px] mx-auto">
              {actionText}
            </p>

            <button
              onClick={onCancel}
              className="px-10 py-4 rounded-2xl bg-destructive/10 text-destructive font-black text-sm uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-2 active:scale-95"
            >
              <X className="w-5 h-5" />
              Interrupt Action
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
