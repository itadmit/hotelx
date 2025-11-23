import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        {/* Pricing Teaser can go here later or be part of Features */}
      </main>
      <Footer />
    </div>
  );
}
