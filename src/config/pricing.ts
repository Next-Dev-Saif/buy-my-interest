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
    name: "Free",
    price: 0,
    description: "Essential discovery for casual users.",
    tagline: "Basic monitoring and AI assistance.",
    cta: "Start for Free",
    href: "/get-started?plan=free",
    icon: Search,
    image: "/images/feature_ai.png",
    gradient: "from-foreground to-foreground/70",
    iconClassName: "text-muted-foreground",
    features: [
      "24-Hour scan frequency",
      "Full AI Assistant access",
      "20 AI Agent messages",
      "Standard marketplace coverage",
      "Email notifications",
    ],
    checkoutFeatures: [
      { title: "Daily Scan", desc: "Once per day marketplace updates.", icon: Clock },
      { title: "AI Assistant", desc: "Interactive AI for search optimization.", icon: Sparkles },
      { title: "Standard Reach", desc: "Covers major marketplaces and categories.", icon: Globe },
      { title: "Email Alerts", desc: "Stay informed with standard notifications.", icon: Bell },
    ],
  },
  {
    id: "pro",
    name: "Premium",
    price: 19,
    description: "High-velocity discovery for serious buyers.",
    tagline: "Twice-daily monitoring and expanded AI reach.",
    cta: "Go Premium",
    href: "/checkout/pro",
    popular: true,
    icon: Target,
    image: "/images/feature_ai.png",
    gradient: "from-primary to-emerald-300",
    iconClassName: "text-primary",
    features: [
      "12-Hour scan frequency",
      "Full AI Assistant access",
      "200 AI messages / 5 hours",
      "Deep marketplace coverage",
      "Verified match alerts",
      "Priority scanning queue",
    ],
    checkoutFeatures: [
      { title: "12-Hour Scans", desc: "Twice-daily updates for faster discovery.", icon: Clock },
      { title: "Extended AI", desc: "200 messages every 5 hours.", icon: Sparkles },
      { title: "Deep Connectivity", desc: "Extensive niche forum monitoring.", icon: Globe },
      { title: "Priority Queue", desc: "Faster processing for your searches.", icon: Zap },
    ],
  },
  {
    id: "elite",
    name: "Ultra",
    price: 49,
    description: "Maximum discovery performance for professionals.",
    tagline: "High-frequency monitoring and unlimited AI support.",
    cta: "Go Ultra",
    href: "/checkout/elite",
    icon: Zap,
    image: "/images/feature_dashboard.png",
    gradient: "from-primary to-cyan-300",
    iconClassName: "text-primary",
    features: [
      "5-Hour scan frequency",
      "Full AI Assistant access",
      "1000 AI messages / 3 hours",
      "Full web coverage",
      "Concierge listing verification",
      "Multi-source aggregation",
    ],
    checkoutFeatures: [
      { title: "5-Hour Scans", desc: "High-frequency updates for competitive edge.", icon: Clock },
      { title: "Pro AI Access", desc: "1000 messages every 3 hours.", icon: Sparkles },
      { title: "Full Web Reach", desc: "Maximum computational priority.", icon: Globe },
      { title: "Concierge Check", desc: "Enhanced verification for premium listings.", icon: ShieldCheck },
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

