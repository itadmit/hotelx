"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Globe, Palette, Building2, Save, Trash2 } from "lucide-react";

export default function HotelSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [primaryColor, setPrimaryColor] = useState("bg-indigo-600");

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-20 z-10 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hotel Settings</h1>
          <p className="text-gray-500 mt-1">Configure your hotel's identity and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition-transform active:scale-95">
             Discard
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 cursor-pointer transition-transform active:scale-95">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
         {/* Sidebar Navigation */}
         <div className="md:col-span-1 space-y-4 sticky top-48">
            <div className="bg-white rounded-2xl p-2 shadow-sm">
               <nav className="space-y-1">
                  <button 
                    onClick={() => scrollToSection("general")}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "general" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                     <Building2 className="h-4 w-4" /> General Info
                  </button>
                  <button 
                    onClick={() => scrollToSection("branding")}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "branding" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                     <Palette className="h-4 w-4" /> Branding & Look
                  </button>
                  <button 
                    onClick={() => scrollToSection("localization")}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${activeTab === "localization" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                     <Globe className="h-4 w-4" /> Localization
                  </button>
               </nav>
            </div>
         </div>

         {/* Main Form Area */}
         <div className="md:col-span-2 space-y-8">
            <div id="general" className="bg-white rounded-3xl p-8 shadow-sm space-y-6 scroll-mt-24 transition-all hover:shadow-md">
               <div>
                  <h3 className="font-bold text-lg text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-500">This info will appear on your guest app</p>
               </div>
               
               <div className="space-y-6">
                  <div className="grid gap-2">
                     <Label htmlFor="hotelName" className="text-gray-700">Hotel Name</Label>
                     <Input 
                        id="hotelName" 
                        defaultValue="Grand Hotel" 
                        className="rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all" 
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="logo" className="text-gray-700">Hotel Logo</Label>
                     <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors bg-gray-50/50">
                        <div className="h-20 w-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                           GH
                        </div>
                        <div className="space-y-2">
                           <Button variant="outline" size="sm" className="rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                              <Upload className="mr-2 h-4 w-4" /> Upload New
                           </Button>
                           <p className="text-xs text-gray-400">Recommended: 512x512px, PNG or JPG</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div id="branding" className="bg-white rounded-3xl p-8 shadow-sm space-y-6 scroll-mt-24 transition-all hover:shadow-md">
               <div>
                  <h3 className="font-bold text-lg text-gray-900">Branding</h3>
                  <p className="text-sm text-gray-500">Customize the look and feel</p>
               </div>

               <div className="space-y-6">
                  <div className="grid gap-2">
                     <Label className="text-gray-700">Primary Color</Label>
                     <div className="flex gap-3 flex-wrap">
                        {['bg-blue-600', 'bg-indigo-600', 'bg-rose-600', 'bg-orange-500', 'bg-emerald-600'].map((color, i) => (
                           <button 
                              key={i} 
                              onClick={() => setPrimaryColor(color)}
                              className={`h-10 w-10 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-all ${color} ${primaryColor === color ? 'ring-4 ring-offset-2 ring-indigo-100 scale-110' : ''}`}
                              aria-label="Select color"
                           ></button>
                        ))}
                     </div>
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="font" className="text-gray-700">Font Family</Label>
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
                  <h3 className="font-bold text-lg text-gray-900">Localization</h3>
                  <p className="text-sm text-gray-500">Set language and currency</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                     <Label htmlFor="language" className="text-gray-700">Default Language</Label>
                     <select id="language" className="flex h-11 w-full rounded-xl border-none bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <option>English</option>
                        <option>Hebrew</option>
                        <option>Spanish</option>
                     </select>
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="currency" className="text-gray-700">Currency</Label>
                     <select id="currency" className="flex h-11 w-full rounded-xl border-none bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <option>USD ($)</option>
                        <option>ILS (₪)</option>
                        <option>EUR (€)</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-8 shadow-sm space-y-6 border border-red-100 transition-all hover:shadow-md hover:border-red-200">
               <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                  <div>
                     <h3 className="font-bold text-lg text-red-900">Danger Zone</h3>
                     <p className="text-sm text-red-700/70">Irreversible actions</p>
                  </div>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl gap-2 w-full sm:w-auto cursor-pointer">
                     <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}