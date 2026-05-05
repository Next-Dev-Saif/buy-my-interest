"use client";

import Link from "next/link";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "@/config/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[980px] rounded-full bg-primary/15 blur-[140px]" />
      <Container className="z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-5">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
            Pricing
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.05] font-editorial">
            Choose your monitoring cadence.
          </h2>
          <p className="text-lg text-secondary leading-relaxed">
            Start free, upgrade when you want faster scans and wider coverage.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-3xl border ${
                plan.popular ? "border-primary/70 ring-1 ring-primary/40" : "border-border/80"
              } glass`}
            >
              <div className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity ${plan.popular ? "opacity-100" : ""}`}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
              </div>

              <div className="relative mb-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-secondary">
                      {plan.popular ? "Most Chosen" : "Plan"}
                    </p>
                    <h3 className="text-2xl font-black text-foreground font-editorial">{plan.name}</h3>
                  </div>
                  <div className="w-11 h-11 rounded-2xl border border-border/80 bg-background/40 backdrop-blur flex items-center justify-center">
                    <plan.icon className={`w-5 h-5 ${plan.iconClassName}`} />
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black tracking-tight text-foreground">${plan.price}</span>
                    <span className="text-secondary font-semibold ml-2 text-sm">/mo</span>
                  </div>
                  <div className={`hidden sm:block text-right text-[10px] font-bold uppercase tracking-[0.22em] bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`}>
                    {plan.id === "free" ? "Baseline" : "Priority"}
                  </div>
                </div>

                <p className="mt-5 text-secondary text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={3} />
                    <span className="text-sm font-semibold text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.99] ${
                  plan.popular
                    ? `text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20`
                    : `text-foreground bg-background/60 border border-border/80 hover:bg-muted/40`
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
