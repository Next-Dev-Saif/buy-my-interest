"use client";

import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/globals/Container";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { planById, type PlanId } from "@/config/pricing";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const resolvedParams = use(params);
  const planId = resolvedParams.plan.toLowerCase() as PlanId;
  const plan = planById[planId];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!plan)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <Link
          href="/#pricing"
          className="text-primary hover:underline font-bold"
        >
          Return to Pricing
        </Link>
      </div>
    );

  const ctaClassName =
    planId === "free"
      ? "bg-foreground text-background hover:bg-foreground/90"
      : `text-primary-foreground bg-gradient-to-r ${plan.gradient} hover:shadow-primary/30`;

  return (
    <div className="min-h-screen py-20 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <Container className="z-10 relative">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all mb-12 group font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Plan Selection
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 items-stretch">
          {/* Left Side: Plan Showcase */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight text-foreground font-editorial">
                A faster way to <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`}>
                  spot the right deal.
                </span>
              </h1>
              <p className="text-lg text-secondary max-w-xl font-medium leading-relaxed">
                {plan.tagline}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {plan.checkoutFeatures.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-6 rounded-2xl border border-border/80 space-y-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <item.icon className={`w-6 h-6 ${plan.iconClassName}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Promo Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-0.5 bg-gradient-to-r ${plan.gradient} rounded-2xl shadow-md`}
            >
              <div className="bg-card rounded-[calc(1rem-1px)] p-6 flex items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-1 text-foreground">
                    Launch Priority Status
                  </h4>
                  <p className="text-secondary text-sm font-medium">
                    Your current rate is protected for the lifetime of your
                    active subscription.
                  </p>
                </div>
                <div className="hidden sm:block relative w-20 h-20 opacity-10">
                  <Sparkles className={`w-full h-full ${plan.iconClassName}`} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden"
              >
                {/* Card Header Image */}
                <div className="relative h-40 w-full bg-muted/30">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover opacity-40 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h2 className="text-2xl font-bold text-foreground">
                      {plan.name} Tier
                    </h2>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-center pb-6 border-b border-border">
                    <span className="font-bold text-secondary uppercase tracking-widest text-[10px]">
                      Monthly Total
                    </span>
                    <div className="text-right">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-secondary text-xs font-bold ml-1">
                        / USD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Secure Payment
                      </span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Stripe Certified
                      </span>
                    </div>
                    <p className="text-[10px] text-secondary text-center font-medium">
                      Complete your upgrade securely on the next page.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Link
                      href={`/get-started?plan=${planId}`}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${ctaClassName}`}
                    >
                      Complete Upgrade <ArrowRight className="w-5 h-5" />
                    </Link>

                    <div className="flex items-center justify-center gap-5 pt-2">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                          Instant
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                          No Contracts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trust Banner */}
              <div className="mt-8 flex items-center justify-center gap-4 opacity-50 px-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center text-secondary">
                  Trusted by over 12,000 professionals worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
