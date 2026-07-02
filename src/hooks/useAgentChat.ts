import { useEffect } from "react";
import { useAgentChatContext } from "@/context/AgentChatContext";

export function useAgentChat(onStateChange?: (state: "idle" | "thinking" | "analyzing") => void) {
  const context = useAgentChatContext();

  useEffect(() => {
    if (onStateChange) {
      onStateChange(context.agentState);
    }
  }, [context.agentState, onStateChange]);

  return context;
}
