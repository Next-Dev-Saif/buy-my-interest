"use client";

import { motion } from "framer-motion";
import Container from "@/components/globals/Container";
import Image from "next/image";
import { TrendingUp, Users, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "Direct Lead Engagement",
    desc: "Bypass aggregator fees. Connect directly with high-intent buyers through our verified communication pipeline.",
    icon: Users,
  },
  {
    title: "Performance Analytics",
    desc: "Track view velocity, conversion ratios, and market demand for your inventory in real-time.",
    icon: TrendingUp,
  },
  {
    title: "Verified Trust Status",
    desc: "Earn the 'Verified Seller' badge to boost buyer confidence and priority in discovery results.",
    icon: ShieldCheck,
  }
];

export default function SellerAdvantage() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1200&auto=format&fit=crop" 
                alt="Professional business interaction"
                fill
                className="object-cover"
              />
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="absolute -bottom-10 -right-4 md:right-10 bg-card/95 p-8 rounded-xl border border-border shadow-md max-w-xs backdrop-blur-md"
            >
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 text-center">Avg. Listing Velocity</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-extrabold text-foreground">12.4%</span>
                <div className="flex flex-col">
                  <span className="text-primary font-black text-sm flex items-center">
                    <ArrowUpRight className="w-4 h-4" /> 2.1%
                  </span>
                  <span className="text-[9px] font-bold text-secondary uppercase">this month</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-12 order-1 lg:order-2">
            <div className="space-y-5 text-center lg:text-left">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
                For Sellers
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                Your bridge to <br />
                <span className="text-primary">qualified demand.</span>
              </h2>
              <p className="text-lg text-secondary font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Stop chasing leads and start managing relationships. Our platform provides the data and the connectivity to scale your marketplace presence.
              </p>
            </div>

            <div className="space-y-8">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                    <benefit.icon className="w-7 h-7 text-secondary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-foreground">{benefit.title}</h4>
                    <p className="text-secondary font-medium text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link 
                href="/dashboard"
                className="px-8 py-4 rounded-xl bg-foreground text-background text-sm font-semibold hover:-translate-y-1 active:translate-y-0 transition-transform duration-150 shadow-md"
              >
                Become a Verified Seller
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
