import React from "react";
import { motion } from "framer-motion";

export const AgentOrb = ({ state }: { state: "idle" | "thinking" | "analyzing" }) => {
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
