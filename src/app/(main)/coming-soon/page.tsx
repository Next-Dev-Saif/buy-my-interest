"use client";

import ComingSoonLock from "@/components/globals/ComingSoonLock";
import WaveCanvas from "@/components/animations/WaveCanvas";
import { useTheme } from "next-themes";

export default function ComingSoonPage() {
  const { theme } = useTheme();
  const waveColor = theme === "dark" ? "#00f2ff" : "#0f766e";

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-6">
      {/* Background Waves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <WaveCanvas color={waveColor} opacity={0.2} speedMultiplier={1} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <ComingSoonLock 
          title="Dropping Soon" 
          description="We're currently scaling our infrastructure and fine-tuning our proprietary discovery algorithms. These features are being deployed in phases to ensure maximum stability and data integrity."
        />
      </div>
    </main>
  );
}
