import Link from "next/link";
import Image from "next/image";
import { Sparkles, Target, Zap, Bot, Search, Bell, Crosshair, ArrowRight } from "lucide-react";
import Container from "@/components/globals/Container";
import PricingSection from "@/components/page-sections/home/PricingSection";
import StickyPricingBanner from "@/components/globals/StickyPricingBanner";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <Container className="pt-24 pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 z-10 relative">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            AI-Powered Discovery Engine
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Find Your Dream <br />
            <span className="text-gradient">Interest Instantly.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Whether it's the perfect Golden Retriever, a vintage sports car, a modern villa, or a prime plot of land. Tell us what you want, and our AI will scour the web to find the best matches.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/get-started" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
               Start Searching Now
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8">
             <div className="flex items-center gap-3 text-sm text-foreground/80">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <Target className="w-5 h-5 text-primary" />
               </div>
               <span className="font-medium">Highly Targeted</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-foreground/80">
               <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                 <Zap className="w-5 h-5 text-purple-500" />
               </div>
               <span className="font-medium">2-Hour Auto Fetch</span>
             </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass">
                <Image 
                  src="/images/hero.png" 
                  alt="Collage of cars, houses and pets" 
                  width={800} 
                  height={800}
                  className="w-full h-auto object-cover"
                />
            </div>
        </div>
      </Container>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <Container className="z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold">How It Works</h2>
            <p className="text-lg text-foreground/70">Three simple steps to finding exactly what you need without lifting a finger.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="text-6xl font-black text-foreground/5 mb-6 group-hover:text-primary/10 transition-colors">01</div>
              <h3 className="text-xl font-bold mb-3">Set Parameters</h3>
              <p className="text-foreground/70">Tell our AI your exact requirements, from breed and model to location and budget.</p>
            </div>
            {/* Step 2 */}
            <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
              <div className="text-6xl font-black text-foreground/5 mb-6 group-hover:text-purple-500/10 transition-colors">02</div>
              <h3 className="text-xl font-bold mb-3">AI Agents Deploy</h3>
              <p className="text-foreground/70">Our intelligent crawlers scan hundreds of marketplaces continuously every 2 hours.</p>
            </div>
            {/* Step 3 */}
            <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="text-6xl font-black text-foreground/5 mb-6 group-hover:text-blue-500/10 transition-colors">03</div>
              <h3 className="text-xl font-bold mb-3">Review Matches</h3>
              <p className="text-foreground/70">Get notified instantly when a match is found and view it in your personalized dashboard.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-foreground/5 relative">
        <Container className="z-10 relative">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-3xl lg:text-5xl font-bold">Driven by Advanced AI</h2>
                <p className="text-lg text-foreground/70">Our system works tirelessly in the background to bring you exactly what you're looking for, saving you hundreds of hours of manual searching.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                <div className="space-y-6 order-2 md:order-1">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold">Intelligent Web Scraping</h3>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                        We deploy autonomous agents to scan marketplaces, classifieds, and specialized directories. They understand context, filter out spam, and extract only the most relevant details matching your exact criteria.
                    </p>
                    <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-primary"/> <span className="text-foreground/80">Real-time data processing</span></li>
                        <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-primary"/> <span className="text-foreground/80">Multi-source aggregation</span></li>
                    </ul>
                </div>
                <div className="relative order-1 md:order-2">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl" />
                    <Image src="/images/feature_ai.png" alt="AI Network" width={600} height={600} className="relative rounded-3xl border border-white/10 shadow-xl" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-2xl" />
                    <Image src="/images/feature_dashboard.png" alt="Dashboard Interface" width={600} height={600} className="relative rounded-3xl border border-white/10 shadow-xl" />
                </div>
                <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Search className="w-7 h-7 text-purple-500" />
                    </div>
                    <h3 className="text-3xl font-bold">Personalized Dashboard</h3>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                        All your tailored results are organized in a clean, intuitive dashboard. Review matches, compare options, and track new discoveries as they roll in every two hours.
                    </p>
                    <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-purple-500"/> <span className="text-foreground/80">Smart filtering</span></li>
                        <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-purple-500"/> <span className="text-foreground/80">Continuous updates</span></li>
                    </ul>
                </div>
            </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <Container className="z-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-primary/20 text-xs font-medium text-primary">
                <Crosshair className="w-3 h-3" />
                Data Schemas
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold">Discover Any Interest</h2>
              <p className="text-lg text-foreground/70">Our models are trained to extract relevant structured data across multiple verticals with 99% accuracy.</p>
            </div>
            <Link href="/get-started" className="text-primary font-semibold hover:underline flex items-center gap-2 group">
              Deploy an Agent <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pets", icon: Bot, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Purebreds, rescues, and specific traits." },
              { title: "Cars", icon: Zap, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", desc: "Vintage classics or specific models." },
              { title: "Houses", icon: Search, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", desc: "Dream homes matching your exact criteria." },
              { title: "Plots", icon: Target, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", desc: "Commercial or residential land opportunities." },
            ].map((cat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:-translate-y-2 hover:border-white/20 transition-all duration-300 cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${cat.bg} ${cat.border} border group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                <p className="text-foreground/60 text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PricingSection />
      
      {/* CTA Section */}
      <section className="py-32 text-center">
        <Container>
          <div className="glass max-w-4xl mx-auto rounded-3xl p-12 lg:p-20 border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
             <Bell className="w-16 h-16 text-primary mx-auto mb-6" />
             <h2 className="text-4xl lg:text-5xl font-bold mb-6">Stop Searching. Start Finding.</h2>
             <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">Tell our AI exactly what you're looking for, sit back, and let the perfect matches come directly to you.</p>
             <Link href="/get-started" className="inline-flex px-10 py-5 rounded-xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
                 Get Started Now
             </Link>
          </div>
        </Container>
      </section>
      <StickyPricingBanner />
    </div>
  );
}
