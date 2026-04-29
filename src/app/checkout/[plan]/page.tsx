"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, ArrowRight, ArrowLeft, Sparkles, Globe, Cpu, Clock, Rocket } from "lucide-react";
import Link from "next/link";
import Container from "@/components/globals/Container";
import { useTheme } from "next-themes";
import { useState, useEffect, use } from "react";
import Image from "next/image";

const plans = {
  vanguard: {
    name: "Vanguard",
    price: 10,
    icon: Zap,
    image: "/images/feature_ai.png",
    color: "from-purple-600 to-indigo-600",
    textColor: "text-purple-400",
    bg: "bg-purple-500/10",
    tagline: "Unleash high-frequency search intelligence.",
    features: [
      { title: "1-Hour Triggers", desc: "Our agents scan 24x faster than free tier.", icon: Clock },
      { title: "Global Reach", desc: "Deep-web marketplace & niche forum scanning.", icon: Globe },
      { title: "Unlimited Scopes", desc: "Search across every category simultaneously.", icon: Rocket },
      { title: "Verified Data", desc: "AI-powered listing verification for accuracy.", icon: ShieldCheck }
    ]
  },
  apex: {
    name: "Apex",
    price: 25,
    icon: ShieldCheck,
    image: "/images/feature_dashboard.png",
    color: "from-indigo-600 to-blue-600",
    textColor: "text-indigo-400",
    bg: "bg-indigo-500/10",
    tagline: "Total search dominance. Instant results.",
    features: [
      { title: "15-Min Triggers", desc: "Be the first to see every new listing.", icon: Zap },
      { title: "Elite Core", desc: "Maximum AI processing priority worldwide.", icon: Cpu },
      { title: "Predictive AI", desc: "Identify deals before they hit mainstream.", icon: Sparkles },
      { title: "Concierge Check", desc: "Manual & AI hybrid listing verification.", icon: ShieldCheck }
    ]
  }
};

export default function CheckoutPage({ params }: { params: Promise<{ plan: string }> }) {
  const resolvedParams = use(params);
  const planId = resolvedParams.plan.toLowerCase() as keyof typeof plans;
  const plan = plans[planId];
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!plan) return <div className="min-h-screen flex items-center justify-center">Plan not found</div>;

  return (
    <div className="min-h-screen py-20 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-${plan.textColor.split('-')[1]}-500/10 blur-[180px]`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Container className="z-10 relative">
        <Link href="/#pricing" className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-all mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Selection
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 items-stretch">
          
          {/* Left Side: Plan Showcase */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-${plan.textColor.split('-')[1]}-500/20 text-xs font-black uppercase tracking-widest ${plan.textColor}`}
               >
                 <plan.icon className="w-4 h-4" /> Priority Level: {plan.name}
               </motion.div>
               <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight">
                 Ready for <br/>
                 <span className={`bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>Total Dominance?</span>
               </h1>
               <p className="text-xl text-foreground/60 max-w-xl font-medium">
                 {plan.tagline}
               </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
               {plan.features.map((item, i) => (
                 <motion.div 
                   key={item.title}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass p-6 rounded-[2rem] border-white/5 space-y-4"
                 >
                   <div className={`w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 ${plan.textColor}`} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">{item.title}</h3>
                     <p className="text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            {/* Promo Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-1 bg-gradient-to-r ${plan.color} rounded-[2.5rem]`}
            >
              <div className="bg-background rounded-[2.4rem] p-8 flex items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                   <h4 className="text-2xl font-black mb-1">Limited Time Launch Offer</h4>
                   <p className="text-foreground/60 text-sm">Lock in this legacy price for the lifetime of your account.</p>
                </div>
                <div className="hidden sm:block relative w-32 h-32 opacity-20">
                   <Sparkles className={`w-full h-full ${plan.textColor}`} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="glass rounded-[3.5rem] border-white/10 shadow-2xl overflow-hidden"
               >
                 {/* Card Header Image */}
                 <div className="relative h-48 w-full">
                    <Image src={plan.image} alt={plan.name} fill className="object-cover opacity-50" />
                    <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent`} />
                    <div className="absolute bottom-6 left-8">
                       <h2 className="text-3xl font-black uppercase italic tracking-tighter">{plan.name} Intelligence</h2>
                    </div>
                 </div>

                 <div className="p-10 space-y-10">
                    <div className="flex justify-between items-center pb-8 border-b border-white/5">
                       <span className="font-bold text-foreground/40 uppercase tracking-widest text-xs">Subscription Total</span>
                       <div className="text-right">
                          <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                          <span className="text-foreground/40 font-bold ml-1">/MO</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-white/5">
                          <span className="text-sm font-bold text-foreground/70">Payment Method</span>
                          <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Secure Stripe Checkout</span>
                       </div>
                       <p className="text-xs text-foreground/40 text-center">
                         You will be redirected to our secure payment sheet.
                       </p>
                    </div>

                    <div className="space-y-4">
                      <Link
                        href={`/get-started?plan=${planId}`}
                        className={`w-full py-6 rounded-2xl font-black text-xl text-white transition-all flex items-center justify-center gap-3 shadow-2xl bg-gradient-to-r ${plan.color} hover:shadow-primary/40`}
                      >
                        Launch Your Agent <ArrowRight className="w-6 h-6" />
                      </Link>
                      
                      <div className="flex items-center justify-center gap-6 pt-4">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Secure</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Instant</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">No Hidden Fees</span>
                         </div>
                      </div>
                    </div>
                 </div>
               </motion.div>

               {/* Trust Banner */}
               <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale hover:opacity-100 transition-all duration-500 px-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">TRUSTED BY ELITE HUNTERS WORLDWIDE</p>
               </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
