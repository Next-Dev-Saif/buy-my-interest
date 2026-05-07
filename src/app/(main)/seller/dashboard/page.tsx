import { Metadata } from "next";
import SellerDashboard from "@/components/page-sections/seller/SellerDashboard";
import Container from "@/components/globals/Container";

export const metadata: Metadata = {
  title: "Seller Dashboard | BuyMyInterests.ai",
  description: "Manage your listings and connect with highly targeted buyers.",
};

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen py-12 lg:py-20 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[180px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Container className="z-10 relative">
        <SellerDashboard />
      </Container>
    </div>
  );
}
