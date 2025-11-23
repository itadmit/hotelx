import Link from "next/link";
import { ArrowRight, QrCode, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Full support for 30+ languages
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 tracking-tight mb-6 max-w-5xl">
          Elevate Guest Experience & Revenue with <span className="text-primary relative inline-block">
            QR-Based Service
            <svg className="absolute left-0 -bottom-1 w-full h-3 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 8 Q 50 5 100 8" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Allow guests to order services, food, and spa treatments directly from their phone - no app download required.
          A smart management system that saves staff time and boosts your bottom line.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
          <Link 
            href="/signup"
            className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/demo"
            className="inline-flex items-center justify-center h-14 px-8 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-lg hover:bg-gray-50 transition-colors"
          >
            Book a Demo
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            5-minute setup
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Cancel anytime
          </div>
        </div>

        {/* Mockup Placeholder */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="aspect-video rounded-2xl bg-white border border-gray-200 shadow-2xl flex items-center justify-center overflow-hidden relative z-10">
            <div className="absolute inset-0 bg-gray-50/50"></div>
            
            {/* Simple Dashboard UI Representation */}
            <div className="w-full h-full p-4 flex gap-4 opacity-80">
               {/* Sidebar */}
               <div className="w-64 bg-white h-full rounded-xl border border-gray-100 shadow-sm hidden md:block p-4 space-y-4">
                  <div className="h-8 w-32 bg-gray-100 rounded-lg mb-8"></div>
                  <div className="space-y-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-full bg-gray-50 rounded-lg"></div>)}
                  </div>
               </div>
               {/* Main Content */}
               <div className="flex-1 h-full flex flex-col gap-4">
                  <div className="h-16 w-full bg-white rounded-xl border border-gray-100 shadow-sm flex items-center px-6 justify-between">
                    <div className="h-6 w-48 bg-gray-100 rounded-lg"></div>
                    <div className="h-10 w-10 bg-blue-50 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                      <div className="h-48 bg-blue-50 rounded-xl w-full"></div>
                      <div className="h-32 bg-gray-50 rounded-xl w-full"></div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-24 bg-green-50 rounded-xl w-full"></div>
                       <div className="h-24 bg-orange-50 rounded-xl w-full"></div>
                       <div className="h-full bg-gray-50 rounded-xl w-full"></div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
              <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50">
                <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-gray-900 text-xl font-bold">Advanced Admin Dashboard + Guest App</p>
                <p className="text-gray-500 mt-2">All in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

