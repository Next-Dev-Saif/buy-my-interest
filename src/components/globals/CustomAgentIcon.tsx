import { SVGProps } from "react";

export function CustomAgentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <mask id="eyeMask">
          <rect width="24" height="24" fill="white" />
          <ellipse cx="9.5" cy="11.5" rx="1.2" ry="1.8" fill="black" />
          <ellipse cx="14.5" cy="11.5" rx="1.2" ry="1.8" fill="black" />
        </mask>
      </defs>

      {/* Outer Rotating Aura */}
      <circle 
        cx="12" cy="12" r="10" 
        stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6 3 6" 
        strokeLinecap="round"
        opacity="0.8"
        className="origin-center animate-[spin_6s_linear_infinite]"
      />
      
      {/* Inner Rotating Aura (reverse) */}
      <circle 
        cx="12" cy="12" r="7.5" 
        stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" 
        strokeLinecap="round"
        opacity="0.5"
        className="origin-center animate-[spin_4s_linear_infinite_reverse]"
      />

      {/* Solid Core with Eyes Masked Out */}
      <circle 
        cx="12" cy="12" r="5" 
        fill="currentColor" 
        mask="url(#eyeMask)"
      />
    </svg>
  );
}
