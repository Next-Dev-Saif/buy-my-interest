"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, Loader2, RefreshCcw, ShieldCheck, Globe, Clock, Search, Layout, Plus } from "lucide-react";
import Container from "@/components/globals/Container";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

import { AgentAvatar } from "./AgentAvatar";
import { AgentOrb } from "./AgentOrb";
import { TypingIndicator } from "./TypingIndicator";
import { AgentListingsModal } from "./AgentListingsModal";

import { useAgentChat } from "@/hooks/useAgentChat";

export default function AgentInterface({ onStateChange }: { onStateChange?: (state: "idle" | "thinking" | "analyzing") => void }) {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();

  const {
    messages,
    input,
    setInput,
    isLoading,
    agentState,
    userPlan,
    scrollRef,
    textareaRef,
    currentLimit,
    messagesSent,
    handleSend,
    startNewChat,
    discoveredListings,
    setDiscoveredListings
  } = useAgentChat(onStateChange);

  // Auto-scroll on mount
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [scrollRef]);

  if (authLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground font-editorial tracking-tight">Authentication Required</h2>
        <p className="text-sm font-medium text-secondary text-center max-w-sm">
          Please sign in to access your personal Discovery Agent and personalized market matches.
        </p>
      </div>
    );
  }

  return (
    <>
      <AgentListingsModal
        isOpen={discoveredListings.length > 0}
        onClose={() => setDiscoveredListings([])}
        listings={discoveredListings}
      />
      <div className="relative flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[550px] max-h-[850px]">
        {/* Sidebar (Hidden on mobile, right side on desktop) */}
        <div className="hidden lg:flex flex-col gap-4 shrink-0 w-80 relative z-10">
          <div className="glass rounded-[2.5rem] p-8 border border-border/40 shadow-2xl flex flex-col items-center text-center space-y-6 overflow-hidden group relative">

            <AgentAvatar size="lg" />

            <div className="space-y-1 relative z-10">
              <h2 className="text-2xl font-black text-foreground font-editorial tracking-tight">Alex</h2>
              <div className="flex items-center justify-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${agentState !== "idle" ? "bg-emerald-500 animate-pulse" : "bg-primary"}`} />
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                  {agentState === "idle" ? " is With you" : agentState === "thinking" ? "Processing..." : "Scanning Market"}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-border/40 relative z-10" />

            <div className="w-full space-y-2.5 relative z-10">
              {[
                { icon: Globe, label: "Listings Searched", val: "Millions" },
                { icon: Clock, label: "Alert Speed", val: "Instant" },
                { icon: Search, label: "Match Quality", val: "Excellent" },
                { icon: Layout, label: "Source Trust", val: "Verified" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-[11px] font-bold text-foreground">{stat.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limit Card */}
          <div className="glass rounded-[2rem] p-6 border border-border/40 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Messages Remaining</p>
                  <p className="text-2xl font-black text-foreground tracking-tight">{currentLimit.max - messagesSent} <span className="text-secondary/40 text-sm">/ {currentLimit.max}</span></p>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                  {userPlan}
                </div>
              </div>
              <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden mb-3">
                <motion.div
                  animate={{ width: `${((currentLimit.max - messagesSent) / currentLimit.max) * 100}%` }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                />
              </div>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5" /> Next reset in {currentLimit.reset}
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="glass w-full rounded-[2rem] p-4 border border-border/40 hover:border-primary/50 hover:bg-primary/5 shadow-xl flex items-center justify-center gap-3 transition-all group"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-foreground">Start New Chat</span>
          </button>
        </div>
        {/* Chat Area */}
        <div className="flex-grow glass rounded-[2rem] md:rounded-[3rem] border border-border/40 flex flex-col shadow-2xl relative z-10 overflow-hidden">

          <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-10 scroll-smooth no-scrollbar relative z-10"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 md:gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className="shrink-0 hidden md:block">
                    {msg.role === "assistant" ? (
                      <AgentAvatar size="md" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-background border border-border/60 text-secondary shadow-xl">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-col max-w-[90%] md:max-w-[75%] space-y-2 md:space-y-3 ${msg.role === "user" ? "items-end" : ""}`}>
                    <div className={`p-4 md:p-7 rounded-md text-sm md:text-[1rem] leading-relaxed border shadow-sm ${msg.role === "assistant"
                      ? "bg-background/40 text-foreground rounded-tl-none border-border/30 backdrop-blur-md"
                      : "bg-primary text-primary-foreground rounded-tr-none border-primary/50 font-medium shadow-2xl shadow-primary/20"
                      }`}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-3 px-2 md:px-4">
                      <span className="text-[9px] md:text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-10 bg-background/60 backdrop-blur-3xl border-t border-border/30 relative z-10">
            <div className="max-w-4xl mx-auto relative group">
              <div className="relative flex items-end gap-2 md:gap-4 glass p-2 md:p-3 rounded-[2rem] md:rounded-[2.5rem] border border-border/60 shadow-2xl focus-within:border-primary/50 transition-all duration-300">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message your discovery agent..."
                  className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg text-foreground placeholder:text-secondary/30 font-medium resize-none max-h-[120px] md:max-h-[180px]"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || messagesSent >= currentLimit.max}
                  className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/30 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              </div>

              {messagesSent >= currentLimit.max && (
                <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-full bg-background border border-border/60 shadow-2xl">
                  <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span className="text-[9px] md:text-[10px] font-black text-foreground uppercase tracking-widest whitespace-nowrap">
                    Message Limit Reached
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </>
  );
}
