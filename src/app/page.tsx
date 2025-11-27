import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { DemoSection } from "@/components/marketing/DemoSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { Benefits } from "@/components/marketing/Benefits";
import { SmartMonitoring } from "@/components/marketing/SmartMonitoring";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HotelX',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '127',
  },
  description: 'Digital guest service platform for hotels. QR-code ordering, real-time request management, and smart analytics.',
  image: 'https://hotelx.app/og-image.jpg',
  url: 'https://hotelx.app',
  author: {
    '@type': 'Organization',
    name: 'HotelX',
    url: 'https://hotelx.app',
  },
  provider: {
    '@type': 'Organization',
    name: 'HotelX',
    url: 'https://hotelx.app',
    logo: 'https://hotelx.app/favicon.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@hotelx.app',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hebrew', 'Spanish', 'French', 'German'],
    },
  },
  featureList: [
    'QR Code Ordering System',
    'Real-time Request Management',
    'Multi-language Support (15+ languages)',
    'Smart Analytics Dashboard',
    'Guest Feedback System',
    'Staff Coordination Tools',
    'Customizable Service Menu',
    'Mobile-first Design',
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="grow">
        <Hero />
        <DemoSection />
        <HowItWorks />
        <Benefits />
        <Features />
        <SmartMonitoring />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
