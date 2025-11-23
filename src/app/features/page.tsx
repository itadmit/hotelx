import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Features } from "@/components/marketing/Features";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Everything You Need to Modernize Your Hotel
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools designed specifically for hotel operations.
            </p>
          </div>
          <Features />
          <div className="mt-16 text-center">
            <Link href="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

