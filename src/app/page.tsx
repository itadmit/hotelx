import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { Benefits } from "@/components/marketing/Benefits";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Features />
        <Pricing />
        <Testimonials />
        
        {/* Final CTA Section */}
        <section className="py-24 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Hotel?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of hotels already enjoying smarter, more efficient, and profitable management.
              Try HotelX free for 14 days.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 text-lg h-14 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                Start Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-blue-200 opacity-80">
              No commitment • No credit card required • 24/7 Support
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
