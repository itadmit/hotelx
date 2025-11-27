"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, ExternalLink, CheckCircle2, ArrowRight, QrCode, LayoutDashboard, Server, Calendar, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText("demo@hotelx.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText("demo123");
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-heading mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-8">
              We&apos;ve received your request. Our team will contact you within 24 hours to schedule your demo.
            </p>
            <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
              Experience HotelX
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our platform instantly or schedule a personalized demo with our team.
            </p>
          </div>

          {/* Instant Demo Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-2">
                    Try It Now - No Registration Required
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Explore our live demo environment. See how guests interact with the system and how staff manages requests in real-time.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Guest View */}
                <Link 
                  href="/g/hilton/HIL101"
                  target="_blank"
                  className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <QrCode className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Guest Experience</h3>
                      <p className="text-sm text-slate-500">See it from guest perspective</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm">
                    Experience the seamless ordering process guests see when they scan the QR code in their room.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                    Explore Guest View
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Dashboard View */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <LayoutDashboard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Admin Dashboard</h3>
                      <p className="text-sm text-slate-500">Full management interface</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm">
                    Access the complete dashboard with demo credentials to see how staff manages requests and monitors operations.
                  </p>
                  <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
                    <div className="text-xs font-semibold text-purple-900 mb-2">Demo Credentials:</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600 font-medium min-w-[60px]">Email:</span>
                        <span className="font-mono text-purple-700 flex-1">demo@hotelx.app</span>
                        <button
                          onClick={handleCopyEmail}
                          className="p-1.5 rounded-md hover:bg-purple-100 transition-colors text-purple-600 hover:text-purple-700"
                          title="העתק אימייל"
                        >
                          {copiedEmail ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600 font-medium min-w-[60px]">Password:</span>
                        <span className="font-mono text-purple-700 flex-1">demo123</span>
                        <button
                          onClick={handleCopyPassword}
                          className="p-1.5 rounded-md hover:bg-purple-100 transition-colors text-purple-600 hover:text-purple-700"
                          title="העתק סיסמה"
                        >
                          {copiedPassword ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/login"
                    className="inline-flex items-center text-purple-600 font-medium text-sm hover:gap-2 transition-all"
                  >
                    Access Dashboard
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-4 py-3 border border-slate-200">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span>No registration or credit card required. Explore freely and see how HotelX works.</span>
              </div>
            </div>
          </div>

          {/* On-Premise Installation Section */}
          <div className="mb-16">
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-2">
                    Full Installation at Your Property
                  </h2>
                  <p className="text-slate-600 text-lg mb-4">
                    For hotels requiring complete on-premise installation or custom integration, we offer full deployment services at your location.
                  </p>
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <Calendar className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-900 mb-1">Requires Coordination</div>
                      <p className="text-sm text-amber-800">
                        Full installation requires scheduling with our technical team. We&apos;ll work with you to plan the deployment, ensure compatibility with your existing systems, and provide on-site training for your staff.
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">On-Site Setup</div>
                        <div className="text-sm text-slate-600">Complete installation at your hotel</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Custom Integration</div>
                        <div className="text-sm text-slate-600">Connect with your existing systems</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Staff Training</div>
                        <div className="text-sm text-slate-600">Comprehensive on-site training included</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Ongoing Support</div>
                        <div className="text-sm text-slate-600">Dedicated technical support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Demo Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-3">
                Schedule a Personalized Demo
              </h2>
              <p className="text-slate-600">
                Book a live demo with our team. We&apos;ll show you how HotelX can transform your hotel operations.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="hotelName">Hotel Name *</Label>
                  <Input id="hotelName" name="hotelName" required disabled={isLoading} className="h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input id="contactPerson" name="contactPerson" required disabled={isLoading} className="h-12" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required disabled={isLoading} className="h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" disabled={isLoading} className="h-12" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" disabled={isLoading} className="h-12" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" disabled={isLoading} className="h-12" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rooms">Number of Rooms</Label>
                <Input id="rooms" name="rooms" type="number" disabled={isLoading} className="h-12" />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-semibold">
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Request Demo
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

