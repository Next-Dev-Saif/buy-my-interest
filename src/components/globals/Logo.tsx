import React from 'react';

export const Logo = ({ className = "w-10 h-10", textColor = "text-foreground", showText = true }: { className?: string; textColor?: string; showText?: boolean }) => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Icon Wrapper */}
      <div className={`relative flex-shrink-0 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        >
          {/* Main Container - Geometric Shield/Target */}
          <path
            d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinejoin="round"
            className="text-primary/10"
          />
          
          {/* Target Crosshairs - Precision Finding */}
          <path
            d="M50 15V25M50 75V85M15 50H25M75 50H85"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-primary/40"
          />
          
          {/* Central Interest Mark - The 'i' Diamond */}
          <path
            d="M50 35L62 50L50 65L38 50L50 35Z"
            fill="currentColor"
            className="text-primary"
          />
          <rect x="47" y="68" width="6" height="6" rx="1" fill="currentColor" className="text-primary" />
          
          {/* Dynamic Search Arch */}
          <path
            d="M25 35C20 40 20 60 25 65"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-primary"
          >
             <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="2s" repeatCount="indefinite" />
          </path>
          <path
            d="M75 65C80 60 80 40 75 35"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-primary"
          >
             <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="2s" repeatCount="indefinite" />
          </path>

          {/* Glow/Pulse Animation */}
          <circle cx="50" cy="50" r="10" fill="currentColor" className="text-primary/20">
             <animate attributeName="r" values="10;25;10" dur="3s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        
        {/* Shadow Glow */}
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full -z-10 group-hover:bg-primary/20 transition-colors" />
      </div>

      {showText && (
        <div className="hidden sm:flex flex-col">
          <span className={`font-black text-xl lg:text-3xl tracking-tighter leading-none ${textColor}`}>
            BUYMY<span className="text-primary">INTERESTS</span>
          </span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] mt-0.5 opacity-60">
            Discovery Engine
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
