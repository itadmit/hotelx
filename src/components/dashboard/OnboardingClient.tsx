"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Palette, Check, ArrowRight, Star, Settings } from "lucide-react";
import { createHotel } from "@/app/actions/hotel";
import { useRouter } from "next/navigation";

interface OnboardingClientProps {
  userEmail: string;
}

export function OnboardingClient({ userEmail }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [hotelName, setHotelName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [roomCount, setRoomCount] = useState("10");
  const [starRating, setStarRating] = useState(3);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "room-service",
    "housekeeping",
    "concierge"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", hotelName);
      formData.append("primaryColor", primaryColor);
      formData.append("wifiName", `${hotelName}_Guest`);
      formData.append("roomCount", roomCount);
      formData.append("starRating", starRating.toString());
      formData.append("selectedServices", JSON.stringify(selectedServices));
      
      const result = await createHotel(formData);
      
      if (result.success) {
        // Mark that user has completed onboarding
        localStorage.setItem("hasCompletedOnboarding", "true");
        localStorage.setItem("showWhatsNew", "true");
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert("Failed to create hotel. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const defaultServices = [
    { id: "room-service", name: "Room Service", icon: "🍽️", description: "Food & beverage delivery" },
    { id: "housekeeping", name: "Housekeeping", icon: "🧹", description: "Room cleaning & maintenance" },
    { id: "concierge", name: "Concierge", icon: "🛎️", description: "Guest assistance & information" },
    { id: "laundry", name: "Laundry Service", icon: "👔", description: "Washing & ironing" },
    { id: "spa", name: "Spa & Wellness", icon: "💆", description: "Massage & treatments" },
    { id: "transport", name: "Transportation", icon: "🚗", description: "Taxi & shuttle service" },
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const colors = [
    { hex: "#2563eb", class: "bg-blue-600", name: "Blue" },
    { hex: "#4f46e5", class: "bg-indigo-600", name: "Indigo" },
    { hex: "#e11d48", class: "bg-rose-600", name: "Rose" },
    { hex: "#f97316", class: "bg-orange-500", name: "Orange" },
    { hex: "#10b981", class: "bg-emerald-600", name: "Emerald" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-16 transition-all ${
                      step > s ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Step {step} of 3
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to HotelX! 🎉
            </h1>
            <p className="text-gray-500">
              Let's set up your hotel in just a few steps
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Hotel Name */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Hotel Information</h2>
                    <p className="text-sm text-gray-500">Tell us about your hotel</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hotelName" className="text-gray-700 font-medium">
                    Hotel Name *
                  </Label>
                  <Input
                    id="hotelName"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    placeholder="e.g. Grand Hotel"
                    required
                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50"
                  />
                  <p className="text-xs text-gray-400">
                    This name will appear on your guest app and QR codes
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (hotelName.trim()) setStep(2);
                  }}
                  disabled={!hotelName.trim()}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Branding */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Palette className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Branding</h2>
                    <p className="text-sm text-gray-500">Choose your primary color</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Label className="text-gray-700 font-medium">Primary Color</Label>
                  <div className="flex gap-4 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setPrimaryColor(color.hex)}
                        className={`h-14 w-14 rounded-2xl cursor-pointer shadow-md hover:scale-110 transition-all ${color.class} ${
                          primaryColor === color.hex
                            ? "ring-4 ring-offset-2 ring-indigo-100 scale-110"
                            : ""
                        }`}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Hotel Details & Services */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Settings className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Hotel Details</h2>
                    <p className="text-sm text-gray-500">Complete your hotel profile</p>
                  </div>
                </div>

                {/* Room Count */}
                <div className="grid gap-2">
                  <Label htmlFor="roomCount" className="text-gray-700 font-medium">
                    Number of Rooms
                  </Label>
                  <Input
                    id="roomCount"
                    type="number"
                    min="1"
                    max="10000"
                    value={roomCount}
                    onChange={(e) => setRoomCount(e.target.value)}
                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Star Rating */}
                <div className="grid gap-2">
                  <Label className="text-gray-700 font-medium">Hotel Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setStarRating(rating)}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            rating <= starRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Services */}
                <div className="grid gap-2">
                  <Label className="text-gray-700 font-medium">Default Services</Label>
                  <p className="text-xs text-gray-400 mb-2">
                    Select the services you want to offer (you can customize later)
                  </p>
                  <div className="grid gap-3">
                    {defaultServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                          selectedServices.includes(service.id)
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-indigo-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{service.icon}</div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.description}</div>
                          </div>
                          <div className="mt-1">
                            {selectedServices.includes(service.id) ? (
                              <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 mb-2">Almost Done! 🎉</h3>
                  <p className="text-sm text-indigo-700">
                    After completing setup, you'll be able to add rooms and start generating QR codes for your guests.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !hotelName.trim() || selectedServices.length === 0}
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

