import InterestForm from "@/components/page-sections/home/InterestForm";
import { Activity, Database, ShieldCheck } from "lucide-react";
import Container from "@/components/globals/Container";

export const metadata = {
  title: "Initialize Agent | BuyMyInterests.ai",
  description: "Configure your search parameters and deploy your AI interest hunting agents.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden py-12 lg:py-20 bg-background">
      {/* Simple Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <Container className="z-10 relative">
        <div className="max-w-2xl mx-auto text-center mb-12 lg:mb-16 space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground font-editorial">
            Get Started.
          </h1>
          <p className="text-lg text-secondary max-w-lg mx-auto font-medium leading-relaxed">
            Please complete the steps below to set up your profile and search parameters.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <InterestForm />
        </div>
      </Container>
    </div>
  );
}
