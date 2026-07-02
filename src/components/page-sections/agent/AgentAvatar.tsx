import React from "react";
import Image from "next/image";

export const AgentAvatar = ({ size = "sm", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const dimensions = size === "sm" ? "w-10 h-10" : size === "md" ? "w-16 h-16" : "w-32 h-32";
  const defaultBg = className.includes("bg-") ? "" : "bg-background border border-primary/20 shadow-lg";

  return (
    <div className={`${dimensions} ${defaultBg} relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center group ${className}`}>
      {/* Animated SVG Aura Background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-0.5 opacity-80 z-0">
        <circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="15 5 5 5"
          className="text-primary/60 origin-center animate-[spin_8s_linear_infinite]"
        />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="10 10"
          className="text-emerald-500/50 origin-center animate-[spin_5s_linear_infinite_reverse]"
        />
        <circle
          cx="50" cy="50" r="35"
          fill="currentColor"
          className="text-primary/10 animate-pulse"
        />
      </svg>

      <Image
        src="/images/agent-avatar.png"
        alt="Discovery Agent"
        fill
        className="object-contain scale-110 relative z-10 transition-transform duration-500 group-hover:scale-125"
      />
    </div>
  );
};
