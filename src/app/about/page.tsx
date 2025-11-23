import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Shield, Zap, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              About HotelX
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empowering hotels to deliver exceptional guest experiences through digital innovation.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-gray-700 leading-relaxed mb-6">
              HotelX was born from a simple observation: hotel guests want instant, seamless service, 
              and hotel staff need better tools to deliver it. We&apos;ve built a platform that connects 
              guests and staff through the power of QR codes and real-time communication.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our mission is to help hotels of all sizes modernize their operations, reduce response times, 
              and ultimately create happier guests. We believe technology should be simple, accessible, 
              and make everyone&apos;s life easier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 rounded-xl bg-gray-50">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Security First</h3>
              <p className="text-gray-600">
                Enterprise-grade security with data encryption and compliance with industry standards.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Real-time updates and instant notifications keep everyone in sync.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50">
              <Globe className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Multi-language support for hotels serving international guests.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50">
              <Heart className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Guest Focused</h3>
              <p className="text-gray-600">
                Every feature is designed with guest satisfaction in mind.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

