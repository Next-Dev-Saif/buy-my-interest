import InterestForm from "@/components/page-sections/home/InterestForm";
import { Activity, Bot, Cpu, Database } from "lucide-react";
import Container from "@/components/globals/Container";

export const metadata = {
  title: "Initialize Agent | BuyMyInterests.ai",
  description: "Configure your search parameters and deploy your AI interest hunting agents.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden py-20 lg:py-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[180px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[180px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Container className="z-10 relative">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm font-semibold text-primary">
            <Activity className="w-4 h-4 animate-pulse" />
            AI Agent Provisioning
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
            Configure Your <br/>
            <span className="text-gradient">Search Intelligence</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Answer a few quick questions to initialize your dedicated AI agents. They will work 24/7 to find your perfect matches.
          </p>
        </div>

        <div className="relative">
          <InterestForm />
        </div>

        {/* System Metadata Footer */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto pt-12 border-t border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs uppercase tracking-widest">
              <Bot className="w-3 h-3" /> System Status
            </div>
            <p className="font-bold text-sm">Operational (100%)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs uppercase tracking-widest">
              <Cpu className="w-3 h-3" /> Core Engine
            </div>
            <p className="font-bold text-sm">v3.4.2-stable</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs uppercase tracking-widest">
              <Database className="w-3 h-3" /> Data Latency
            </div>
            <p className="font-bold text-sm">&lt; 150ms Global</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Active Threads
            </div>
            <p className="font-bold text-sm">14,204 Parallel</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
