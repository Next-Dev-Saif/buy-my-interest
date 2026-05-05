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
    <div className="flex-grow flex flex-col relative overflow-hidden bg-background">
      {/* Subtle Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Hero Section */}
      <Container className="pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16 z-10 relative">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider">
            Enterprise Solutions
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground">
            Connect with Buyers <br />
            <span className="text-primary">Looking for Your Assets.</span>
          </h1>
          
          <p className="text-lg text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Reach high-intent prospects instantly. Our platform identifies buyers who have already defined their interest in your specific categories and locations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/get-started?role=seller" className="px-8 py-4 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md">
               Start Selling <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/seller/dashboard" className="px-8 py-4 rounded-lg bg-white border border-border text-foreground font-bold text-lg hover:bg-muted/50 transition-all flex items-center justify-center gap-2 shadow-sm">
               Partner Dashboard
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl p-2 bg-card">
                <Image 
                  src="/images/feature_dashboard.png" 
                  alt="Seller Dashboard Preview" 
                  width={800} 
                  height={800}
                  className="w-full h-auto object-cover rounded-lg"
                />
            </div>
        </div>
      </Container>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30 border-y border-border relative">
        <Container className="z-10 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Why Partner with Us?</h2>
            <p className="text-lg text-secondary">Advanced marketplace analytics and direct buyer matching.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Precision Targeting", 
                icon: Target, 
                desc: "We match your listings with buyers whose search criteria align perfectly with your inventory." 
              },
              { 
                title: "Real-time Alerts", 
                icon: Zap, 
                desc: "Receive instant notifications when new buyers enter your target market segments." 
              },
              { 
                title: "Market Analytics", 
                icon: BarChart3, 
                desc: "Gain deep insights into search volume and demand trends for your items globally." 
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Verification Section */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="flex-1">
                <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl">
                   <Image src="/images/feature_ai.png" alt="Buyer Verification" width={600} height={600} className="w-full" />
                </div>
             </div>
             <div className="flex-1 space-y-8">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 text-primary">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Verified Buyer Network</h2>
                <p className="text-lg text-secondary leading-relaxed">
                  Our platform verifies search intent to ensure you're connecting with serious buyers. Maximize your conversion rates by focusing on high-intent leads.
                </p>
                <ul className="space-y-4">
                   {[
                     "Identity-verified buyer profiles",
                     "Algorithmic intent scoring",
                     "Secure communication channels",
                     "Priority marketplace placement"
                   ].map((item) => (
                     <li key={item} className="flex items-center gap-3 font-bold text-sm text-foreground">
                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                           <ShieldCheck className="w-3 h-3 text-primary" />
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
      <section className="py-24">
        <Container>
          <div className="bg-primary rounded-2xl p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
             <h2 className="text-3xl lg:text-5xl font-bold mb-6">Scale Your Sales Distribution</h2>
             <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
               Join our professional network of sellers and let our technology bring the right customers to your business.
             </p>
             <Link href="/get-started?role=seller" className="inline-flex px-10 py-4 rounded-lg bg-white text-primary font-bold text-lg hover:bg-white/90 transition-all shadow-lg">
                Get Started Today
             </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
