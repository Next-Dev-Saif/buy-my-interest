"use client";

import { ArrowRight, Car, Home, Map, PawPrint } from "lucide-react";
import Container from "@/components/globals/Container";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    title: "Elite Pets",
    icon: PawPrint,
    color: "from-primary to-cyan-300",
    desc: "Search for specific breeds, KCI registered lineages, and specialized traits across global breeders.",
    stats: "2.4k Active Searches",
  },
  {
    title: "Premium Vehicles",
    icon: Car,
    color: "from-primary to-emerald-300",
    desc: "From vintage classics to modern luxury models, we scan niche enthusiast forums and specialized marketplaces.",
    stats: "5.1k Active Searches",
  },
  {
    title: "Global Real Estate",
    icon: Home,
    color: "from-primary to-sky-300",
    desc: "Discover off-market deals, luxury villas, and high-yield investment properties before they reach major portals.",
    stats: "3.8k Active Searches",
  },
  {
    title: "Strategic Land",
    icon: Map,
    color: "from-primary to-teal-300",
    desc: "Identify commercial plots, residential development opportunities, and agricultural land in high-growth regions.",
    stats: "1.2k Active Searches",
  },
];

export default function Categories() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/25 via-background to-background pointer-events-none" />
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-secondary">
              Verticals
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-editorial tracking-tight">
              Tuned for high-value categories.
            </h2>
            <p className="text-lg text-secondary font-semibold leading-relaxed">
              The discovery engine is tuned for these high-intent markets.
            </p>
          </div>
          <Link
            href="/get-started"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            Explore All Categories{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-8 overflow-x-auto sm:overflow-visible no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 pb-8 sm:pb-0">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative min-w-[240px] max-w-[280px] sm:max-w-none sm:min-w-0 h-[360px] sm:h-[450px] rounded-[2.5rem] overflow-hidden border border-border/70 glass shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex-shrink-0"
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              />

              <div className="p-6 sm:p-10 h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4 sm:space-y-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <cat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors font-editorial tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-secondary font-medium text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {cat.desc}
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      Active
                    </span>
                    <span className="text-xs font-black text-foreground">
                      {cat.stats}
                    </span>
                  </div>
                  <Link
                    href={`/get-started?category=${cat.title.toLowerCase()}`}
                    className="w-full py-3.5 px-4 rounded-xl bg-muted/50 border border-border text-[11px] font-bold text-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm active:scale-95"
                  >
                    Select Category
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
