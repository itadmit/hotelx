import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { LanguagesMarquee } from "@/components/marketing/LanguagesMarquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { LivePreview } from "@/components/marketing/LivePreview";
import { Features } from "@/components/marketing/Features";
import { PaymentsSection } from "@/components/marketing/PaymentsSection";
import { InsightsSection } from "@/components/marketing/InsightsSection";
import { FeedbackLoopSection } from "@/components/marketing/FeedbackLoopSection";
import { Audiences } from "@/components/marketing/Audiences";
import { Stats } from "@/components/marketing/Stats";
import { OfferSection } from "@/components/marketing/OfferSection";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { SupportSection } from "@/components/marketing/SupportSection";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <LanguagesMarquee />
        <HowItWorks />
        <LivePreview />
        <Features />
        <PaymentsSection />
        <InsightsSection />
        <FeedbackLoopSection />
        <Audiences />
        <Stats />
        <OfferSection />
        <PricingTeaser />
        <SupportSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
