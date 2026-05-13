"use client";

import React, { useEffect, useRef } from "react";

interface WaveCanvasProps {
  color?: string;
  opacity?: number;
  speedMultiplier?: number;
}

export default function WaveCanvas({ color = "#00f2ff", opacity = 0.15, speedMultiplier = 1 }: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.005 * speedMultiplier;

      const drawWave = (side: "left" | "right", waveOpacity: number) => {
        ctx.save();
        ctx.globalAlpha = waveOpacity;
        
        const gradient = ctx.createLinearGradient(
          side === "left" ? 0 : canvas.width, 
          0, 
          side === "left" ? canvas.width * 0.2 : canvas.width * 0.8, 
          0
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;

        ctx.beginPath();
        if (side === "left") {
          ctx.moveTo(0, 0);
          const baseWidth = canvas.width * 0.12;
          for (let y = 0; y <= canvas.height; y += 5) {
            const x = baseWidth + Math.sin(y * 0.004 + time) * 40 + Math.sin(y * 0.01 + time * 0.5) * 20;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(0, canvas.height);
        } else {
          ctx.moveTo(canvas.width, 0);
          const baseWidth = canvas.width * 0.88;
          for (let y = 0; y <= canvas.height; y += 5) {
            const x = baseWidth + Math.sin(y * 0.005 + time * 0.8) * 45 + Math.cos(y * 0.008 + time * 0.6) * 25;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(canvas.width, canvas.height);
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

    drawWave("left", opacity * 1.5);
    drawWave("right", opacity * 1.2);

    animationFrameId = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  draw();

  return () => {
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(animationFrameId);
  };
}, [color, opacity, speedMultiplier]);

return (
  <canvas
    ref={canvasRef}
    className="absolute inset-0 w-full h-full pointer-events-none z-0"
  />
);
}
