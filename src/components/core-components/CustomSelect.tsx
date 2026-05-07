"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: any;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
  className = "",
  label,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-background border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium outline-none cursor-pointer flex items-center justify-between transition-all hover:border-primary/30 group/btn ${
            isOpen ? "ring-2 ring-primary/10 border-primary/40" : ""
          } ${error ? "border-red-500 ring-red-500/10" : ""}`}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isOpen ? "text-primary" : "text-secondary/30"
                }`}
              />
            )}
            <span className={selectedOption ? "text-foreground" : "text-secondary/40"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-secondary/30 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 z-[160] glass overflow-hidden rounded-xl shadow-2xl border border-border"
            >
              <div className="p-1 max-h-60 overflow-y-auto no-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group/opt ${
                      value === option.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-secondary hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {option.label}
                    {value === option.value && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-red-500 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";
