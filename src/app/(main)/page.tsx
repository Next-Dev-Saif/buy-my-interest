import Hero from "@/components/page-sections/home/Hero";
import Process from "@/components/page-sections/home/Process";
import FeatureGrid from "@/components/page-sections/home/FeatureGrid";
import Categories from "@/components/page-sections/home/Categories";
import PricingSection from "@/components/page-sections/home/PricingSection";
import CallToAction from "@/components/page-sections/home/CallToAction";
import StickyPricingBanner from "@/components/globals/StickyPricingBanner";

import MarketIntelligence from "@/components/page-sections/home/MarketIntelligence";
import SellerAdvantage from "@/components/page-sections/home/SellerAdvantage";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col relative overflow-hidden bg-background">
      <Hero />
      <Process />
      <MarketIntelligence />
      <FeatureGrid />
      <SellerAdvantage />
      <Categories />
      <PricingSection />
      <CallToAction />
      <StickyPricingBanner />
    </div>
  );
}
