"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Book a Live Demo
            </h1>
            <p className="text-lg text-gray-600">
              See HotelX in action. Our team will show you how to transform your hotel operations.
            </p>
          </div>

          <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="hotelName">Hotel Name *</Label>
                <Input id="hotelName" name="hotelName" required disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" name="contactPerson" required disabled={isLoading} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" disabled={isLoading} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" disabled={isLoading} />
              </div>
            </div>

            <div className="grid gap-2 mb-6">
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input id="rooms" name="rooms" type="number" disabled={isLoading} />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Request Demo
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

