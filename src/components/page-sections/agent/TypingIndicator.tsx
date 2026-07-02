import React from "react";
import { motion } from "framer-motion";
import { AgentAvatar } from "./AgentAvatar";

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-4 md:gap-5"
  >
    <AgentAvatar size="sm" />
    <div className="bg-muted/10 backdrop-blur-md border border-border/20 p-4 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5">
      <motion.span 
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-primary" 
      />
      <motion.span 
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        className="w-1.5 h-1.5 rounded-full bg-primary" 
      />
      <motion.span 
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
        className="w-1.5 h-1.5 rounded-full bg-primary" 
      />
    </div>
  </motion.div>
);
