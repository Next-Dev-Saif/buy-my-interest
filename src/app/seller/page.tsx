import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, BarChart3, ArrowRight, ShieldCheck } from "lucide-react";
import Container from "@/components/globals/Container";

export const metadata: Metadata = {
  title: "Sell Your Interests | BuyMyInterests.ai",
  description: "Connect with highly qualified buyers searching for exactly what you offer.",
};

export default function SellerPage() {
  return (
    <div className="flex-grow flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <Container className="pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16 z-10 relative">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-purple-500/20 text-sm font-medium text-purple-400">
            <Users className="w-4 h-4" />
            Seller Intelligence Platform
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Reach Buyers <br />
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-indigo-600">Searching for You.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Stop waiting for customers to find you. Our AI identifies buyers who have already expressed interest in your specific category and location. Connect instantly with high-intent leads.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/get-started?role=seller" className="px-8 py-4 rounded-xl bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)]">
               Start Selling Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/seller/dashboard" className="px-8 py-4 rounded-xl glass border border-white/10 text-foreground font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
               Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass p-2">
                <Image 
                  src="/images/feature_dashboard.png" 
                  alt="Seller Dashboard Preview" 
                  width={800} 
                  height={800}
                  className="w-full h-auto object-cover rounded-[2.5rem]"
                />
            </div>
        </div>
      </Container>

      {/* Why Sell Here Section */}
      <section className="py-24 bg-foreground/5 relative">
        <Container className="z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold">Why List with AI?</h2>
            <p className="text-lg text-foreground/70">Traditional marketplaces are noisy. Our platform is surgical.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Precision Matching", 
                icon: Target, 
                color: "text-purple-400", 
                desc: "We match your listings with buyers whose search parameters align perfectly with what you're selling." 
              },
              { 
                title: "Instant Lead Alerts", 
                icon: Zap, 
                color: "text-amber-400", 
                desc: "Get notified the moment a buyer initializes an agent looking for items in your category." 
              },
              { 
                title: "Market Insights", 
                icon: BarChart3, 
                color: "text-blue-400", 
                desc: "Understand search volume and demand trends for your items in real-time." 
              },
            ].map((feature, i) => (
              <div key={i} className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="flex-1">
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                   <Image src="/images/feature_ai.png" alt="AI Verification" width={600} height={600} className="w-full" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
             </div>
             <div className="flex-1 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                   <ShieldCheck className="w-7 h-7 text-green-500" />
                </div>
                <h2 className="text-4xl font-bold">Verified Buyer Network</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Our AI agents verify search intent to ensure you're only connecting with serious buyers. No more low-ballers, no more time-wasters. Just high-conversion opportunities.
                </p>
                <ul className="space-y-4">
                   {[
                     "Identity-verified buyer profiles",
                     "AI-filtered interest signals",
                     "Secure communication channel",
                     "Priority listing placement"
                   ].map((item) => (
                     <li key={item} className="flex items-center gap-3 font-medium">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                           <ShieldCheck className="w-3 h-3 text-green-500" />
                        </div>
                        {item}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <Container>
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
             <h2 className="text-4xl lg:text-6xl font-black mb-8">Ready to Connect?</h2>
             <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
               Join the most advanced interest-based marketplace and let our AI bring the right customers to your door.
             </p>
             <Link href="/get-started?role=seller" className="inline-flex px-12 py-6 rounded-2xl bg-white text-purple-700 font-black text-xl hover:bg-white/90 transition-all shadow-2xl">
                Get Started Now
             </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
