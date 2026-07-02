"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Plus } from "lucide-react";
import { useAgentChat } from "@/hooks/useAgentChat";
import { useAuth } from "@/context/AuthContext";
import { AgentAvatar } from "../page-sections/agent/AgentAvatar";
import { TypingIndicator } from "../page-sections/agent/TypingIndicator";
import { AgentListingsModal } from "../page-sections/agent/AgentListingsModal";
import { CustomAgentIcon } from "./CustomAgentIcon";

export default function FloatingAgentButton() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    textareaRef,
    handleSend,
    startNewChat,
    discoveredListings,
    setDiscoveredListings
  } = useAgentChat();

  // Auto-scroll when opened
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isOpen, scrollRef]);

  // Hide on /agent
  if (pathname?.startsWith("/agent")) {
    return null;
  }

  return (
    <>
      <AgentListingsModal
        isOpen={discoveredListings?.length > 0}
        onClose={() => setDiscoveredListings([])}
        listings={discoveredListings || []}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed z-[9999] bottom-[90px] right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[600px] max-h-[calc(100vh-120px)] glass rounded-3xl border border-border/40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/30 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AgentAvatar size="sm" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Alex</h3>
                  <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={startNewChat} title="New Chat" className="p-2 bg-muted/20 hover:bg-primary/20 hover:text-primary rounded-full transition-colors text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close" className="p-2 bg-muted/20 hover:bg-destructive/20 hover:text-destructive rounded-full transition-colors text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {user ? (
              <>
                {/* Chat Area */}
                <div
                  ref={scrollRef}
                  className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-background/50"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed border shadow-sm max-w-[85%] ${msg.role === "assistant"
                          ? "bg-background/80 text-foreground rounded-tl-none border-border/30"
                          : "bg-primary text-primary-foreground rounded-tr-none border-primary/50 font-medium"
                          }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <TypingIndicator />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border/30">
                  <div className="relative flex items-end gap-2 p-2 bg-muted/20 rounded-2xl border border-border/40 focus-within:border-primary/50 transition-colors">
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
                      placeholder="Ask anything..."
                      className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 resize-none max-h-[120px]"
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="shrink-0 p-2 rounded-xl bg-primary text-primary-foreground shadow-md disabled:opacity-50 transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-background/50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Login Required</h3>
                <p className="text-xs font-medium text-secondary">
                  Please sign in to access your personal Discovery Agent.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed z-[9999] bottom-4 right-4 md:bottom-6 md:right-6 flex items-center justify-center shadow-2xl shadow-primary/40 transition-all bg-primary text-primary-foreground rounded-full overflow-hidden ${isOpen
          ? "w-14 h-14 border border-primary-foreground/20"
          : "w-16 h-16"
          }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <AgentAvatar size="md" className="bg-transparent border-none shadow-none !rounded-full" />}
      </motion.button>
    </>
  );
}
