import InterestForm from "@/components/page-sections/home/InterestForm";
import { Activity, Database, ShieldCheck } from "lucide-react";
import Container from "@/components/globals/Container";

export const metadata = {
  title: "Initialize Agent | BuyMyInterests.ai",
  description: "Configure your search parameters and deploy your AI interest hunting agents.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden py-20 lg:py-32 bg-background">
      {/* Subtle Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <Container className="z-10 relative">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider">
            Onboarding
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Setup Your Search
          </h1>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            Answer a few quick questions to customize your search parameters. Our platform will monitor the market 24/7 for you.
          </p>
        </div>

        <div className="relative">
          <InterestForm />
        </div>

        {/* Professional Footer Context */}
        <div className="mt-24 max-w-4xl mx-auto pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-left space-y-1">
              <p className="text-sm font-bold text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 Secure & Private
              </p>
              <p className="text-xs text-secondary">Your search criteria are encrypted and private.</p>
           </div>
           <div className="text-center md:text-left space-y-1">
              <p className="text-sm font-bold text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
                 <Activity className="w-4 h-4 text-primary" />
                 Global Coverage
              </p>
              <p className="text-xs text-secondary">Access to hundreds of international marketplaces.</p>
           </div>
           <div className="text-center md:text-left space-y-1">
              <p className="text-sm font-bold text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
                 <Database className="w-4 h-4 text-primary" />
                 Real-time Data
              </p>
              <p className="text-xs text-secondary">Verified listings refreshed every two hours.</p>
           </div>
        </div>
      </Container>
    </div>
  );
}
