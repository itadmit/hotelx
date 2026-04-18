import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { LanguagesMarquee } from "@/components/marketing/LanguagesMarquee";
import { OutcomesSection } from "@/components/marketing/OutcomesSection";
import { LivePreview } from "@/components/marketing/LivePreview";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ReviewsFlywheelSection } from "@/components/marketing/ReviewsFlywheelSection";
import { GuestExperienceSection } from "@/components/marketing/GuestExperienceSection";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "HotelX — In-Room Concierge & Upselling Platform for Hotels",
  description:
    "Turn every room into a revenue channel. The QR concierge platform that lifts in-room spend, raises your Booking score, and cuts calls to reception — in 14 languages, live in 48 hours.",
  keywords: [
    "hotel concierge app",
    "in-room ordering system",
    "guest messaging platform",
    "hotel upselling software",
    "QR concierge",
    "hotel review management",
    "Booking.com score",
    "hotel guest experience",
  ],
  openGraph: {
    title: "HotelX — Turn every room into a revenue channel",
    description:
      "QR concierge for hotels. Lift in-room spend, raise your Booking score, cut calls to reception — in 14 languages.",
    type: "website",
    siteName: "HotelX",
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelX — In-room concierge & upselling for hotels",
    description:
      "Turn every room into a revenue channel. Live in 48 hours, in 14 languages.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HotelX",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "HospitalityManagement",
  operatingSystem: "Web",
  description:
    "QR-first guest concierge and upselling platform for hotels. In-room ordering, guest messaging, and a smart review loop in 14 languages.",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Hotel marketing managers",
  },
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    description: "$29/month base + $6/room. 6 months of concierge retainer free.",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "27",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow">
        {/* 1. Hero — outcome H1 + 2 KPI chips */}
        <Hero />
        {/* 2. Languages marquee — straight after hero, "we speak your guests' language" */}
        <LanguagesMarquee />
        {/* 3. Outcomes — the 3 numbers a marketing manager cares about */}
        <OutcomesSection />
        {/* 4. Live preview — the dashboard your team uses */}
        <LivePreview />
        {/* 5. How it works — 3 steps, 90 seconds */}
        <HowItWorks />
        {/* 6. Reviews flywheel — the killer story for marketing */}
        <ReviewsFlywheelSection />
        {/* 7. In-room knowledge — moved down per UX plan */}
        <GuestExperienceSection />
        {/* 8. Pricing — single model + price anchor */}
        <PricingTeaser />
        {/* 9. CTA */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
