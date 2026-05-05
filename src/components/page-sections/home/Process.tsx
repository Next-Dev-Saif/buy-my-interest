"use client";

import { Target, Search, Bell, ArrowRight } from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Define Interest",
    desc: "Tell us exactly what you're looking for—model, budget, and location. Our AI learns your preferences.",
    icon: Target,
  },
  {
    step: "02",
    title: "Global Scan",
    desc: "Our agents monitor hundreds of marketplaces, forums, and niche sites every 2 hours for matches.",
    icon: Search,
  },
  {
    step: "03",
    title: "Instant Match",
    desc: "Get notified the second a high-quality match is found. Review all details in your dedicated dashboard.",
    icon: Bell,
  }
];

export default function Process() {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/25 pointer-events-none" />
      <Container className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-24 space-y-5">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
            How It Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground font-editorial tracking-tight">
            Three steps. No noise.
          </h2>
          <p className="text-lg text-secondary font-semibold leading-relaxed">
            Automated discovery engineered for speed and precision.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 relative">
          <div className="hidden md:block absolute top-24 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          {steps.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="mb-10 text-8xl font-black text-foreground/[0.04] absolute -top-12 -left-4 group-hover:text-primary/[0.08] transition-colors select-none">
                {item.step}
              </div>
              
              <div className="w-20 h-20 flex items-center justify-center relative z-10 mb-8 rounded-3xl glass border border-border/70">
                <item.icon className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-black mb-4 text-foreground flex items-center gap-2 font-editorial tracking-tight">
                {item.title}
              </h3>
              <p className="text-secondary leading-relaxed font-semibold">{item.desc}</p>
              
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-8 top-24 text-border group-hover:text-primary transition-colors">
                   <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
