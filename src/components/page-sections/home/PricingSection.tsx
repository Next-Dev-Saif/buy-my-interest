"use client";

import { Check, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";
import Image from "next/image";

const plans = [
  {
    name: "Discovery",
    price: "0",
    description: "Standard searching for casual users.",
    features: [
      "3-Hour Agent Triggers",
      "Standard Search Accuracy",
      "Up to 2 interest categories",
      "Web results only",
      "Email summaries"
    ],
    buttonText: "Start for Free",
    link: "/get-started?plan=free",
    image: "/images/hero.png", // Reusing high-quality generated assets
    color: "from-blue-500/20 to-transparent",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    popular: false
  },
  {
    name: "Vanguard",
    price: "10",
    description: "High-priority triggers for serious hunters.",
    features: [
      "1-Hour Agent Triggers",
      "Enhanced Search Intelligence",
      "Unlimited interest categories",
      "Deep-web & Marketplace scans",
      "Priority processing queue",
      "Verified match alerts"
    ],
    buttonText: "Join Vanguard",
    link: "/checkout/vanguard",
    image: "/images/feature_ai.png",
    color: "from-purple-600/30 to-transparent",
    borderColor: "border-purple-500/50",
    iconColor: "text-purple-400",
    popular: true
  },
  {
    name: "Apex",
    price: "25",
    description: "The ultimate real-time search dominance.",
    features: [
      "15-Min Instant Triggers",
      "Maximum Agent Power",
      "All Vanguard features included",
      "Predictive match analysis",
      "Concierge listing verification",
      "Unlimited simultaneous agents"
    ],
    buttonText: "Go Apex",
    link: "/checkout/apex",
    image: "/images/feature_dashboard.png",
    color: "from-indigo-600/40 to-transparent",
    borderColor: "border-indigo-500/60",
    iconColor: "text-indigo-400",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
      
      <Container className="z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm font-bold text-primary uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4" />
            Priority Tiers
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
            Elevate Your <br/>
            <span className="text-gradient">Agent Intelligence</span>
          </h2>
          <p className="text-xl text-foreground/60">
            Scale your search velocity and precision with our elite priority processing units.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              key={plan.name}
              className={`group relative rounded-[3rem] overflow-hidden border ${plan.borderColor} bg-background shadow-2xl transition-all duration-500 hover:-translate-y-4 ${plan.popular ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}
            >
              {/* Image Header with Gradient Overlay */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src={plan.image} 
                  alt={plan.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${plan.color} to-transparent`} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="glass p-6 rounded-3xl border-white/20 backdrop-blur-xl">
                      <h3 className="text-4xl font-black tracking-tighter text-white uppercase italic">{plan.name}</h3>
                   </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-10 space-y-8 relative">
                {plan.popular && (
                  <div className="absolute -top-6 right-10 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                    Highly Recommended
                  </div>
                )}

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                    <span className="text-foreground/40 font-bold ml-1">/MO</span>
                  </div>
                </div>

                <p className="text-foreground/60 font-medium leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full ${plan.iconColor.replace('text', 'bg')}/10 flex items-center justify-center flex-shrink-0`}>
                        <Check className={`w-3.5 h-3.5 ${plan.iconColor}`} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.link}
                  className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]' 
                      : 'bg-foreground/5 text-foreground hover:bg-foreground/10 border border-white/10'
                  }`}
                >
                  {plan.buttonText} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
