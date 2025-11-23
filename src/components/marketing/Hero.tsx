import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Multi-language support
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 tracking-tight mb-6 max-w-4xl">
          Upgrade Your Hotel Service with <span className="text-primary">QR-Based Requests</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Guests scan. Staff responds. Managers see everything. 
          Streamline your hotel operations and boost guest satisfaction without expensive hardware.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/signup"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/demo"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-gray-200 bg-white text-gray-900 font-medium text-lg hover:bg-gray-50 transition-colors"
          >
            Book a Live Demo
          </Link>
        </div>

        {/* Mockup Placeholder */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto">
          <div className="aspect-video rounded-2xl bg-gray-100 border border-gray-200 shadow-2xl flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-white opacity-50"></div>
            <div className="text-center p-8">
              <QrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Dashboard & Guest App Mockup</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 h-64 w-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
          <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        </div>
      </div>
    </section>
  );
}

