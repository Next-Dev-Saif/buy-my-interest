"use client";

import AgentInterface from "@/components/page-sections/agent/AgentInterface";
import Container from "@/components/globals/Container";
import { useState } from "react";
import WaveCanvas from "@/components/animations/WaveCanvas";
import { useTheme } from "next-themes";

export default function AgentPage() {
  const [agentState, setAgentState] = useState<"idle" | "thinking" | "analyzing">("idle");
  const { theme } = useTheme();

  // Determine wave speed based on agent state
  const waveSpeed = agentState === "idle" ? 1 : agentState === "thinking" ? 3 : 6;
  const waveColor = theme === "dark" ? "#00f2ff" : "#0f766e";
  const waveOpacity = theme === "dark" ? (agentState === "idle" ? 0.25 : 0.45) : (agentState === "idle" ? 0.12 : 0.22);

  return (
    <main className="relative py-20 md:py-24 overflow-hidden bg-background min-h-screen">
      {/* Full Length Interactive Waves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <WaveCanvas 
          color={waveColor} 
          opacity={waveOpacity} 
          speedMultiplier={waveSpeed} 
        />
      </div>
      
      <Container className="relative z-10">
        <AgentInterface onStateChange={setAgentState} />
      </Container>
    </main>
  );
}
