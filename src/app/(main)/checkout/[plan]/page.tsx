"use client";

import {
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Lock,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/globals/Container";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { planById, type PlanId } from "@/config/pricing";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const resolvedParams = use(params);
  const planId = resolvedParams.plan.toLowerCase() as PlanId;
  const plan = planById[planId];
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      window.location.href = `/get-started?plan=${planId}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-20">
      {/* Mobile Top Navigation */}
      <div className="sm:hidden fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/40 z-50 flex items-center px-6">
        <Link href="/#pricing" className="p-2 -ml-2 text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <span className="flex-1 text-center font-black uppercase tracking-[0.2em] text-[10px] mr-8">
          Checkout
        </span>
      </div>

      <div className="pt-24 sm:pt-20">
        <Container>
          <Link
            href="/#pricing"
            className="hidden sm:inline-flex items-center gap-2 text-secondary hover:text-primary transition-all mb-12 group font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Plan Selection
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Side: Order & Payment */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-editorial">
                  Unlock the <span className="text-primary">Full Reach.</span>
                </h1>
                <p className="text-base sm:text-lg text-secondary font-medium leading-relaxed">
                  Join 12,000+ professionals using the {plan.name} network for real-time market discovery.
                </p>
              </div>

              {/* Product Card - Mobile App Style */}
              <div className="glass rounded-[2rem] p-6 sm:p-8 border border-border/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-border/60 bg-background/50 backdrop-blur flex items-center justify-center">
                    <plan.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${plan.iconClassName}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-black font-editorial text-foreground">
                        {plan.name}
                      </h3>
                      <span className="text-xl sm:text-2xl font-black text-foreground">${plan.price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary font-medium mt-1">
                      Priority Monitoring & Intelligence
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.checkoutFeatures.map((feature) => (
                    <div key={feature.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground/80">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stripe Mockup Form */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                    <CreditCard size={14} className="text-primary" />
                    Payment Details
                  </h3>
                  <div className="flex items-center gap-2 opacity-50 grayscale">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={30} height={10} />
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={25} height={15} />
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="glass rounded-[2rem] p-6 sm:p-8 border border-border/60 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Card Information</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold text-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                          <input type="text" placeholder="MM/YY" className="w-12 bg-transparent text-center text-sm font-bold placeholder:text-secondary/30 outline-none" />
                          <input type="text" placeholder="CVC" className="w-10 bg-transparent text-center text-sm font-bold placeholder:text-secondary/30 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.displayName || ""}
                          placeholder="John Doe"
                          className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Country</label>
                        <select className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold text-sm appearance-none">
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Germany</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] disabled:opacity-50 text-primary-foreground bg-foreground hover:bg-foreground/90`}
                    >
                      {isProcessing ? "Processing Security Protocols..." : "Authorize Upgrade"}
                      {!isProcessing && <ArrowRight size={16} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="glass rounded-[2.5rem] border border-border/60 overflow-hidden">
                <div className="p-8 sm:p-10 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-secondary">{plan.name} Quarterly</span>
                        <span className="text-foreground">${plan.price}.00</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-secondary">Network Maintenance</span>
                        <span className="text-foreground">$0.00</span>
                      </div>
                      <div className="h-px bg-border/40 my-2" />
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">Total Due</span>
                          <span className="text-4xl font-black font-editorial text-foreground">${plan.price}.00</span>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">USD / Month</span>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Trust */}
                  <div className="p-5 rounded-2xl bg-muted/10 border border-border/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Lock size={14} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground block">Bank-Grade Security</span>
                        <span className="text-[9px] font-medium text-secondary">AES-256 encrypted transaction flow.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Info size={14} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground block">Zero Commitment</span>
                        <span className="text-[9px] font-medium text-secondary">Cancel your subscription at any time.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-3 opacity-40 px-8">
                <ShieldCheck size={14} className="text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-secondary">
                  PCI DSS COMPLIANT SYSTEM
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="sm:hidden fixed bottom-6 inset-x-6 z-[100]">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-16 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-between px-8 shadow-2xl shadow-black/20 disabled:opacity-50 active:scale-95 transition-all"
        >
          <span>{isProcessing ? "Authorizing..." : "Pay Now"}</span>
          <div className="flex items-center gap-3 font-editorial text-lg">
            <span>${plan.price}</span>
            <ChevronRight size={18} className="text-primary" />
          </div>
        </button>
      </div>
    </div>
  );
}
