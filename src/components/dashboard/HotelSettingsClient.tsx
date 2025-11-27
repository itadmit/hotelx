"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Globe, Palette, Building2, Save, Trash2, Star, Download, RotateCcw } from "lucide-react";
import { updateHotelSettings, deleteAccount, importFullDemoData, resetHotelData } from "@/app/actions/hotel";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { toast } from "sonner";

interface Hotel {
  id: string;
  name: string;
  logo: string | null;
  primaryColor: string | null;
  wifiName: string | null;
  language: string | null;
  currency: string | null;
}


export function HotelSettingsClient({ hotel }: { hotel: Hotel }) {
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [primaryColor, setPrimaryColor] = useState(hotel.primaryColor || "#4f46e5");
  const [hotelName, setHotelName] = useState(hotel.name);
  const [wifiName, setWifiName] = useState(hotel.wifiName || `${hotel.name}_Guest`);
  const [logoUrl, setLogoUrl] = useState(hotel.logo || "");
  const [language, setLanguage] = useState(hotel.language || "en");
  const [currency, setCurrency] = useState(hotel.currency || "USD");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [starRating, setStarRating] = useState(3);

  const colorMap: Record<string, string> = {
    "#2563eb": "bg-blue-600",
    "#4f46e5": "bg-indigo-600",
    "#e11d48": "bg-rose-600",
    "#f97316": "bg-orange-500",
    "#10b981": "bg-emerald-600",
  };

  const getColorClass = (hex: string) => {
    return colorMap[hex] || "bg-indigo-600";
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.append("name", hotelName);
    formData.append("logo", logoUrl);
    formData.append("primaryColor", primaryColor);
    formData.append("wifiName", wifiName);
    formData.append("language", language);
    formData.append("currency", currency);
    try {
      const result = await updateHotelSettings(formData);
      if (result.success) {
        // Update language in localStorage and LanguageContext immediately
        if (language && Object.keys({ en: true, bg: true, de: true, fr: true, it: true }).includes(language)) {
          localStorage.setItem("hotelx-lang", language);
          setLanguage(language as "en" | "bg" | "de" | "fr" | "it");
        }
        showTranslatedSuccess("app.toast.success.settings_saved");
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      showTranslatedError("app.toast.error.settings_save_failed");
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      showTranslatedSuccess("app.toast.success.account_deleted");
      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      showTranslatedError("app.toast.error.account_delete_failed");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleImportDemo = async () => {
    setIsImportDialogOpen(true);
  };

  const confirmImportDemo = async () => {
    setIsImportDialogOpen(false);
    setIsImporting(true);
    try {
      const result = await importFullDemoData();
      toast.success(
        translate("app.toast.success.demo_data_imported"),
        {
          description: `Created: ${result.rooms} rooms, ${result.categories} categories, ${result.services} services, ${result.requests} requests`,
          duration: 5000,
        }
      );
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to import demo data:", error);
      showTranslatedError("app.toast.error.demo_import_failed");
      setIsImporting(false);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetHotelData();
      toast.success(
        translate("app.toast.success.data_reset"),
        {
          description: translate("app.toast.success.data_reset") + " All rooms, categories, services, and requests have been deleted. Hotel name has been preserved.",
          duration: 5000,
        }
      );
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to reset data:", error);
      showTranslatedError("app.toast.error.data_reset_failed");
      setIsResetting(false);
      setIsResetDialogOpen(false);
    }
  };

  return (
    <>
      {/* Import Demo Data Confirmation Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate("app.dashboard.settings.import_demo_data") || "Import Demo Data"}</DialogTitle>
            <DialogDescription>
              {translate("app.dashboard.settings.import_demo_warning") || "This will import full demo data including rooms, categories, services, and requests. This will DELETE all existing data. Continue?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              {translate("app.dashboard.requests.cancel")}
            </Button>
            <Button onClick={confirmImportDemo} disabled={isImporting}>
              {isImporting ? translate("app.toast.info.processing") : translate("app.dashboard.settings.import") || "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    <div className="space-y-8 max-w-5xl mx-auto pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{translate("app.dashboard.settings.title")}</h1>
          <p className="text-gray-500 mt-1">{translate("app.dashboard.settings.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => {
              setHotelName(hotel.name);
              setWifiName(hotel.wifiName || `${hotel.name}_Guest`);
              setLogoUrl(hotel.logo || "");
              setPrimaryColor(hotel.primaryColor || "#4f46e5");
            }}
            className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition-transform active:scale-95"
          >
            {translate("app.dashboard.settings.discard")}
          </Button>
          <Button 
            type="submit"
            form="hotel-settings-form"
            disabled={isSaving}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? translate("app.dashboard.common.saving") : translate("app.dashboard.settings.save_changes")}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} id="hotel-settings-form">
        <div className="grid gap-8 md:grid-cols-3 items-start">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-4 sticky top-48">
            <div className="bg-white rounded-2xl p-2 shadow-sm">
              <nav className="space-y-1">
                <button 
                  type="button"
                  onClick={() => scrollToSection("general")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "general" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <Building2 className="h-4 w-4" /> {translate("app.dashboard.settings.general_info")}
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection("branding")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "branding" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <Palette className="h-4 w-4" /> {translate("app.dashboard.settings.branding_look")}
                </button>
                <button 
                  type="button"
                  onClick={() => scrollToSection("localization")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "localization" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <Globe className="h-4 w-4" /> {translate("app.dashboard.settings.localization")}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="md:col-span-2 space-y-8">
            <div id="general" className="bg-white rounded-3xl p-8 shadow-sm space-y-6 scroll-mt-24 transition-all hover:shadow-md">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{translate("app.dashboard.settings.basic_information")}</h3>
                <p className="text-sm text-gray-500">{translate("app.dashboard.settings.basic_info_desc")}</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="hotelName" className="text-gray-700">{translate("app.dashboard.settings.hotel_name")}</Label>
                  <Input 
                    id="hotelName" 
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo" className="text-gray-700">{translate("app.dashboard.common.hotel_logo")}</Label>
                  <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors bg-gray-50/50">
                    {logoUrl ? (
                      <img src={logoUrl} alt={translate("app.dashboard.common.hotel_logo")} className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                        {hotelName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        type="url"
                        placeholder={translate("app.dashboard.settings.logo_url")}
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="rounded-lg bg-white"
                      />
                  <p className="text-xs text-gray-400">{translate("app.dashboard.settings.logo_url_desc")}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
                  <Label htmlFor="roomCount" className="text-gray-700">{translate("app.dashboard.settings.number_of_rooms")}</Label>
                  <Input 
                    id="roomCount" 
                    type="number"
                    min="1"
                    max="10000"
                    defaultValue={10}
                    className="rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all" 
                  />
                  <p className="text-xs text-gray-400">{translate("app.dashboard.settings.number_of_rooms_desc")}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700">{translate("app.dashboard.settings.hotel_rating")}</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setStarRating(rating)}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= starRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{translate("app.dashboard.settings.hotel_rating_desc")}</p>
                </div>
              </div>
            </div>

            <div id="branding" className="bg-white rounded-3xl p-8 shadow-sm space-y-6 scroll-mt-24 transition-all hover:shadow-md">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{translate("app.dashboard.settings.branding")}</h3>
                <p className="text-sm text-gray-500">{translate("app.dashboard.settings.branding_desc")}</p>
              </div>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-gray-700">{translate("app.dashboard.settings.primary_color")}</Label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { hex: "#2563eb", class: "bg-blue-600" },
                      { hex: "#4f46e5", class: "bg-indigo-600" },
                      { hex: "#e11d48", class: "bg-rose-600" },
                      { hex: "#f97316", class: "bg-orange-500" },
                      { hex: "#10b981", class: "bg-emerald-600" }
                    ].map((color) => (
                      <button 
                        key={color.hex}
                        type="button"
                        onClick={() => setPrimaryColor(color.hex)}
                        className={`h-10 w-10 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-all ${color.class} ${primaryColor === color.hex ? 'ring-4 ring-offset-2 ring-indigo-100 scale-110' : ''}`}
                        aria-label="Select color"
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="font" className="text-gray-700">{translate("app.dashboard.settings.font_family")}</Label>
                  <select id="font" className="flex h-11 w-full rounded-xl border-none bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Plus Jakarta Sans</option>
                  </select>
                </div>
              </div>
            </div>

            <div id="localization" className="bg-white rounded-3xl p-8 shadow-sm space-y-6 scroll-mt-24 transition-all hover:shadow-md">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{translate("app.dashboard.settings.localization")}</h3>
                <p className="text-sm text-gray-500">{translate("app.dashboard.settings.localization_desc")}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="language" className="text-gray-700">{translate("app.dashboard.settings.default_language")}</Label>
                  <select 
                    id="language" 
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-11 w-full rounded-xl border-none bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency" className="text-gray-700">{translate("app.dashboard.settings.currency")}</Label>
                  <select 
                    id="currency" 
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-11 w-full rounded-xl border-none bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="ILS">ILS (₪)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="BGN">BGN (лв)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-8 shadow-sm space-y-6 border border-blue-100 transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="font-bold text-lg text-blue-900">Demo Data</h3>
                  <p className="text-sm text-blue-700/70">Import sample hotel data for testing</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleImportDemo}
                  disabled={isImporting}
                  className="bg-white border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl gap-2 w-full sm:w-auto cursor-pointer disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> {isImporting ? "Importing..." : "Import Demo Data"}
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800 mb-2 font-medium">This will create:</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>5 sample rooms</li>
                  <li>6 categories with emojis and images</li>
                  <li>9 services across categories</li>
                  <li>5 open requests</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3 font-medium">⚠️ Warning: This will DELETE all existing rooms, categories, services, and requests!</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-3xl p-8 shadow-sm space-y-6 border border-orange-100 transition-all hover:shadow-md hover:border-orange-200">
              <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="font-bold text-lg text-orange-900">{translate("app.dashboard.common.reset_account")}</h3>
                  <p className="text-sm text-orange-700/70">Clear all data but keep hotel name</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsResetDialogOpen(true)}
                  disabled={isResetting}
                  className="bg-white border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl gap-2 w-full sm:w-auto cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" /> {isResetting ? translate("app.dashboard.common.resetting") : translate("app.dashboard.common.reset_account")}
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-800 mb-2 font-medium">This will delete:</p>
                <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                  <li>All rooms and QR codes</li>
                  <li>All services and categories</li>
                  <li>All guest requests and history</li>
                  <li>Hotel settings (logo, colors, cover image)</li>
                </ul>
                <p className="text-xs text-orange-600 mt-3 font-medium">✅ Hotel name will be preserved</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-8 shadow-sm space-y-6 border border-red-100 transition-all hover:shadow-md hover:border-red-200">
              <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="font-bold text-lg text-red-900">Danger Zone</h3>
                  <p className="text-sm text-red-700/70">Irreversible actions</p>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Reset Account Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-900">{translate("app.dashboard.common.reset_account")}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to reset your account? This will delete all data but keep your hotel name.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-bold text-orange-900 mb-2">This will permanently delete:</h4>
            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
              <li>All rooms and QR codes</li>
              <li>All services and categories</li>
              <li>All guest requests and history</li>
              <li>Hotel settings (logo, colors, cover image)</li>
            </ul>
            <p className="text-sm text-orange-800 mt-3 font-medium">✅ Hotel name will be preserved</p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
              disabled={isResetting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleResetData}
              disabled={isResetting}
              className="rounded-xl bg-orange-600 hover:bg-orange-700 gap-2"
            >
              {isResetting ? (
                <>{translate("app.dashboard.common.resetting")}</>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Yes, {translate("app.dashboard.common.reset_account")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-900">Delete Account</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-bold text-red-900 mb-2">This will permanently delete:</h4>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Your hotel profile and all settings</li>
              <li>All rooms and QR codes</li>
              <li>All services and categories</li>
              <li>All guest requests and history</li>
              <li>All team members associated with your hotel</li>
            </ul>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="rounded-xl bg-red-600 hover:bg-red-700 gap-2"
            >
              {isDeleting ? (
                <>Deleting...</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete Everything
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

