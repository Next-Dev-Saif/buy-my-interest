"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, Loader2, RefreshCcw, ShieldCheck, Globe, Clock, Search, Layout } from "lucide-react";
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

// Optimized Static Avatar for Chat Messages
const AgentAvatar = ({ size = "sm" }: { size?: "sm" | "lg" }) => {
  const dimensions = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  return (
    <div className={`${dimensions} relative rounded-xl overflow-hidden bg-background border border-primary/20 shadow-lg shrink-0 flex items-center justify-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-1 opacity-60">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" transform="rotate(-45 50 50)" />
      </svg>
      {/* Robo Eyes - Static */}
      <div className="relative z-10 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary-rgb),1)]" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary-rgb),1)]" />
      </div>
    </div>
  );
};

// High-Fidelity Animated Persona for Sidebar
const AgentOrb = ({ state }: { state: "idle" | "thinking" | "analyzing" }) => {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
      {/* Outer Glow */}
      <motion.div 
        animate={{ opacity: state !== "idle" ? [0.2, 0.4, 0.2] : 0.2, scale: state !== "idle" ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
      />

      {/* Main Orb Sphere */}
      <motion.div 
        animate={state !== "idle" ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full bg-background border border-border/50 shadow-inner flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
        
        {/* Internal Waves */}
        <motion.svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full opacity-30"
          animate={state !== "idle" ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path
            d="M0 50 Q 25 40, 50 50 T 100 50 V 100 H 0 Z"
            fill="currentColor"
            className="text-primary/20"
            animate={{ d: [
              "M0 50 Q 25 40, 50 50 T 100 50 V 100 H 0 Z",
              "M0 50 Q 25 60, 50 50 T 100 50 V 100 H 0 Z",
              "M0 50 Q 25 40, 50 50 T 100 50 V 100 H 0 Z"
            ]}}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.svg>

        {/* Electron Orbits */}
        <motion.svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full p-2"
          animate={state !== "idle" ? { 
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Orbit Paths */}
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" transform="rotate(-60 50 50)" />
          
          {/* Electrons */}
          <motion.circle 
            r="1.5" fill="currentColor" className="text-primary"
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ 
              duration: state === "analyzing" ? 0.3 : state === "thinking" ? 0.6 : 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ offsetPath: "path('M 50,50 m -42,0 a 42,18 60 1,0 84,0 a 42,18 60 1,0 -84,0')" }}
          />
          <motion.circle 
            r="1.5" fill="currentColor" className="text-primary"
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ 
              duration: state === "analyzing" ? 0.4 : state === "thinking" ? 0.8 : 4, 
              repeat: Infinity, 
              ease: "linear", 
              delay: 0.2 
            }}
            style={{ offsetPath: "path('M 50,50 m -42,0 a 42,18 -60 1,0 84,0 a 42,18 -60 1,0 -84,0')" }}
          />
        </motion.svg>

        {/* Robo Eyes */}
        <div className="relative z-20 flex gap-3">
          {[0, 1].map((i) => (
            <motion.div 
              key={i} 
              className="relative"
              animate={state !== "idle" ? {
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] flex items-center justify-center overflow-hidden"
                animate={{ 
                  scaleY: [1, 1, 0, 1, 1], // Blinking
                }}
                transition={{ 
                  scaleY: { duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], delay: i * 0.1 }
                }}
              >
                {/* Pupil/Glow Detail */}
                <div className="w-1 h-1 bg-white rounded-full opacity-60 blur-[1px]" />
              </motion.div>
              {/* Eye Shadow/Socket */}
              <div className="absolute inset-0 rounded-full border border-primary/40 -m-1" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Precision Dots */}
      {state !== "idle" && (
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              initial={{ x: "50%", y: "50%", opacity: 0 }}
              animate={{ 
                x: ["50%", `${20 + Math.random() * 60}%`],
                y: ["50%", `${20 + Math.random() * 60}%`],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
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

export default function AgentInterface({ onStateChange }: { onStateChange?: (state: "idle" | "thinking" | "analyzing") => void }) {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Discovery Agent. I've prepared a personalized market report based on your profile. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<"idle" | "thinking" | "analyzing">("idle");
  const [userPlan, setUserPlan] = useState<string>("free");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state to parent
  useEffect(() => {
    onStateChange?.(agentState);
  }, [agentState, onStateChange]);

  useEffect(() => {
    async function fetchUserPlan() {
      if (user?.email) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email));
          if (userDoc.exists()) {
            setUserPlan(userDoc.data().plan || "free");
          }
        } catch (error) {
          console.error("Error fetching user plan:", error);
        }
      }
    }
    fetchUserPlan();
  }, [user]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const limits = {
    free: { max: 20, reset: "Daily" },
    pro: { max: 200, reset: "5 Hours" },
    elite: { max: 1000, reset: "3 Hours" },
  };

  const currentLimit = limits[userPlan as keyof typeof limits] || limits.free;
  const messagesSent = messages.filter(m => m.role === "user").length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (authLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (messagesSent >= currentLimit.max) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setAgentState("thinking");

    setTimeout(() => setAgentState("analyzing"), 800);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've completed a deep scan of our verified data sources. There are three potential matches that align with your recent interests. Would you like a prioritized breakdown of these opportunities?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      setAgentState("idle");
    }, 2500);
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[550px] max-h-[850px]">

      {/* Sidebar */}
      <div className="lg:w-80 flex flex-col gap-4 shrink-0 relative z-10">
        <div className="glass rounded-[2.5rem] p-8 border border-border/40 shadow-2xl flex flex-col items-center text-center space-y-6 overflow-hidden group relative">
          
          <AgentOrb state={agentState} />
          
          <div className="space-y-1 relative z-10">
            <h2 className="text-2xl font-black text-foreground font-editorial tracking-tight">Discovery Agent</h2>
            <div className="flex items-center justify-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${agentState !== "idle" ? "bg-emerald-500 animate-pulse" : "bg-primary"}`} />
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                {agentState === "idle" ? "Active Engine" : agentState === "thinking" ? "Processing..." : "Scanning Market"}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border/40 relative z-10" />

          <div className="w-full space-y-2.5 relative z-10">
            {[
              { icon: Globe, label: "Market Coverage", val: "Wide" },
              { icon: Clock, label: "Update Frequency", val: "High" },
              { icon: Search, label: "Search Accuracy", val: "98%" },
              { icon: Layout, label: "Data Quality", val: "Verified" },
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
      </div>

      {/* Chat Area */}
      <div className="flex-grow glass rounded-[3rem] border border-border/40 flex flex-col shadow-2xl relative z-10 overflow-hidden">

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 md:p-12 space-y-10 scroll-smooth no-scrollbar relative z-10"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="shrink-0">
                  {msg.role === "assistant" ? (
                    <AgentAvatar size="lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-background border border-border/60 text-secondary shadow-xl">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-3 ${msg.role === "user" ? "items-end" : ""}`}>
                  <div className={`p-6 md:p-7 rounded-[2.5rem] text-base md:text-lg leading-relaxed border shadow-sm ${
                    msg.role === "assistant"
                      ? "bg-background/40 text-foreground rounded-tl-none border-border/30 backdrop-blur-md"
                      : "bg-primary text-primary-foreground rounded-tr-none border-primary/50 font-medium shadow-2xl shadow-primary/20"
                  }`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-3 px-4">
                    <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">
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
        <div className="p-6 md:p-10 bg-background/60 backdrop-blur-3xl border-t border-border/30 relative z-10">
          <div className="max-w-4xl mx-auto relative group">
            <div className="relative flex items-end gap-4 glass p-3 rounded-[2.5rem] border border-border/60 shadow-2xl focus-within:border-primary/50 transition-all duration-300">
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
                className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none px-6 py-4 text-base md:text-lg text-foreground placeholder:text-secondary/20 font-medium resize-none max-h-[180px]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isLoading || !input.trim() || messagesSent >= currentLimit.max}
                className="shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/30 disabled:opacity-50 transition-all"
              >
                <Send className="w-6 h-6" />
              </motion.button>
            </div>
            
            {messagesSent >= currentLimit.max && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border/60 shadow-2xl">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest whitespace-nowrap">
                  Message Limit Reached
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
