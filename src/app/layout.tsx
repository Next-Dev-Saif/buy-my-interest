import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuyMyInterests.ai",
  description: "Explore the best deals on Pets, Cars, Houses, and Plots, curated by AI.",
};

import { ThemeProvider } from "@/components/globals/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { FrontToolsProvider } from "@/context/FrontToolsProvider";
import { AgentChatProvider } from "@/context/AgentChatContext";
import FloatingAgentButton from "@/components/globals/FloatingAgentButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
      <body className="font-poppins min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AgentChatProvider>
              <FrontToolsProvider>
                {children}
                <FloatingAgentButton />
              </FrontToolsProvider>
            </AgentChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
