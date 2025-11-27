"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hotel, User, Phone, Mail, Clock, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";

interface GuestWelcomeProps {
  hotelName: string;
  roomNumber: string;
  onRegister: (data: { fullName: string; phoneNumber: string; email?: string }) => Promise<void>;
  onGuestMode: () => void;
}

export function GuestWelcome({ hotelName, roomNumber, onRegister, onGuestMode }: GuestWelcomeProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.guest.welcome.${key}`);
  
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError(t("name_required"));
      return;
    }

    if (!phoneNumber.trim()) {
      setError(t("phone_required"));
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError(t("phone_invalid"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
      });
    } catch (err) {
      setError(t("registration_failed"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <Hotel className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">{hotelName}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600">{t("subtitle")}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm text-gray-600">{t("room")}</span>
            <span className="text-lg font-bold text-gray-900">{roomNumber}</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("full_name")} *
              </div>
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("full_name_placeholder")}
              className="h-12"
              disabled={isSubmitting}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("phone_number")} *
              </div>
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t("phone_placeholder")}
              className="h-12"
              disabled={isSubmitting}
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("email")} ({t("optional")})
              </div>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder")}
              className="h-12"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2 text-sm text-green-800">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{t("benefit_1")}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-green-800">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{t("benefit_2")}</span>
            </div>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("registering") : t("register")}
          </Button>
        </form>

        {/* Guest Mode */}
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t("or")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={onGuestMode}
            disabled={isSubmitting}
          >
            {t("continue_as_guest")}
          </Button>

          <p className="text-xs text-gray-500 mt-3">
            {t("guest_mode_warning")}
          </p>
        </div>
      </div>
    </div>
  );
}



