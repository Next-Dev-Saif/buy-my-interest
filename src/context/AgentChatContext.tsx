"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content: "Hello! I'm your Discovery Agent. I've prepared a personalized market report based on your profile. How can I assist you today?",
  timestamp: new Date(),
};

interface AgentChatContextType {
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  agentState: "idle" | "thinking" | "analyzing";
  setAgentState: React.Dispatch<React.SetStateAction<"idle" | "thinking" | "analyzing">>;
  userPlan: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  currentLimit: { max: number; reset: string };
  messagesSent: number;
  handleSend: () => Promise<void>;
  startNewChat: () => void;
  discoveredListings: any[];
  setDiscoveredListings: React.Dispatch<React.SetStateAction<any[]>>;
}

const AgentChatContext = createContext<AgentChatContextType | undefined>(undefined);

export function AgentChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [discoveredListings, setDiscoveredListings] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<"idle" | "thinking" | "analyzing">("idle");
  const [userPlan, setUserPlan] = useState<string>("free");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    async function fetchRecentChat() {
      if (user?.uid) {
        try {
          const q = query(
            collection(db, "chats"),
            where("userId", "==", user.uid),
            orderBy("updatedAt", "desc"),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const chatDoc = querySnapshot.docs[0];
            const data = chatDoc.data();
            setConversationId(chatDoc.id);
            
            if (data.history && Array.isArray(data.history)) {
              const mappedMessages: Message[] = data.history.map((h: any, index: number) => ({
                id: `${chatDoc.id}-${index}`,
                role: h.role === "USER" ? "user" : "assistant",
                content: h.message,
                timestamp: data.updatedAt?.toDate() || new Date()
              }));
              
              if (mappedMessages.length > 0) {
                setMessages(mappedMessages);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching recent chat:", error);
        }
      }
    }
    
    fetchRecentChat();
  }, [user]);

  const startNewChat = () => {
    setConversationId(undefined);
    setMessages([INITIAL_MESSAGE]);
    setDiscoveredListings([]);
  };

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (messagesSent >= currentLimit.max) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const messageText = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setAgentState("thinking");

    try {
      setAgentState("analyzing");
      const token = user ? await user.getIdToken() : "";
      
      const response = await fetch(process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:4000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText,
          conversationId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with agent service");
      }

      const data = await response.json();
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.discoveredItems && data.discoveredItems.length > 0) {
        setDiscoveredListings(data.discoveredItems);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I'm sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Agent error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm currently experiencing connectivity issues. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setAgentState("idle");
    }
  };

  return (
    <AgentChatContext.Provider
      value={{
        messages,
        input,
        setInput,
        isLoading,
        agentState,
        setAgentState,
        userPlan,
        scrollRef,
        textareaRef,
        currentLimit,
        messagesSent,
        handleSend,
        startNewChat,
        discoveredListings,
        setDiscoveredListings,
      }}
    >
      {children}
    </AgentChatContext.Provider>
  );
}

export const useAgentChatContext = () => {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error("useAgentChatContext must be used within an AgentChatProvider");
  }
  return context;
};
