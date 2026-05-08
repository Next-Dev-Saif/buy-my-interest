import Navbar from "@/components/globals/Navbar";
import Footer from "@/components/globals/Footer";
import CookieSync from "@/components/globals/CookieSync";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CookieSync />
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
