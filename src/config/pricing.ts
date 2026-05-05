import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Clock,
  Globe,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export type PlanId = "free" | "pro" | "elite";

export type PlanFeature = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  tagline: string;
  cta: string;
  href: string;
  popular?: boolean;
  icon: LucideIcon;
  image: string;
  gradient: string;
  iconClassName: string;
  features: string[];
  checkoutFeatures: PlanFeature[];
};

export const plans: readonly Plan[] = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    description: "For individuals beginning their search.",
    tagline: "Basic monitoring for casual searches.",
    cta: "Start for Free",
    href: "/get-started?plan=free",
    icon: Search,
    image: "/images/feature_ai.png",
    gradient: "from-foreground to-foreground/70",
    iconClassName: "text-muted-foreground",
    features: [
      "3-Hour scan frequency",
      "Standard marketplace coverage",
      "Up to 2 search categories",
      "Email notifications",
      "Basic dashboard access",
    ],
    checkoutFeatures: [
      { title: "Standard Scan", desc: "3-hour frequency for marketplace updates.", icon: Clock },
      { title: "Essential Reach", desc: "Covers major marketplaces and categories.", icon: Globe },
      { title: "Email Alerts", desc: "Stay informed with standard notifications.", icon: Bell },
      { title: "Search Limits", desc: "Manage up to 2 active search categories.", icon: Search },
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 19,
    description: "Enhanced monitoring for serious buyers.",
    tagline: "High-frequency monitoring for serious buyers.",
    cta: "Get Started",
    href: "/checkout/pro",
    popular: true,
    icon: Target,
    image: "/images/feature_ai.png",
    gradient: "from-primary to-emerald-300",
    iconClassName: "text-primary",
    features: [
      "1-Hour scan frequency",
      "Deep marketplace coverage",
      "Unlimited search categories",
      "Priority scanning queue",
      "Verified match alerts",
      "Advanced filtering",
    ],
    checkoutFeatures: [
      { title: "Rapid Scanning", desc: "1-hour frequency for marketplace updates.", icon: Clock },
      { title: "Broad Connectivity", desc: "Extensive marketplace and niche forum monitoring.", icon: Globe },
      { title: "Unlimited Scope", desc: "Monitor unlimited categories and locations.", icon: Rocket },
      { title: "Priority Queue", desc: "Faster processing for your search parameters.", icon: Zap },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 49,
    description: "Real-time market discovery with concierge verification.",
    tagline: "Maximum performance. Real-time market access.",
    cta: "Go Elite",
    href: "/checkout/elite",
    icon: Zap,
    image: "/images/feature_dashboard.png",
    gradient: "from-primary to-cyan-300",
    iconClassName: "text-primary",
    features: [
      "15-Min instant alerts",
      "Full web coverage",
      "Concierge listing verification",
      "Predictive market analysis",
      "Priority support",
      "Multi-source aggregation",
    ],
    checkoutFeatures: [
      { title: "Instant Alerts", desc: "15-minute frequency for real-time updates.", icon: Zap },
      { title: "Full Web Reach", desc: "Maximum computational priority for your searches.", icon: Globe },
      { title: "Predictive Analytics", desc: "Identify emerging market trends before they scale.", icon: Sparkles },
      { title: "Concierge Check", desc: "Enhanced hybrid verification for premium listings.", icon: ShieldCheck },
    ],
  },
] as const;

export const planById: Record<PlanId, Plan> = plans.reduce(
  (acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  },
  {} as Record<PlanId, Plan>,
);

