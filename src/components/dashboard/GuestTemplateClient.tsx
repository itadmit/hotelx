"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Smartphone, Save, Eye, Image as ImageIcon, Grid3x3, Upload, Download, Check } from "lucide-react";
import { updateGuestTemplate, importDemoData } from "@/app/actions/hotel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  customName: string | null;
  icon: string | null;
  emoji: string | null;
  bgImage: string | null;
  isActive: boolean;
  order: number;
}

interface Hotel {
  id: string;
  name: string;
  logo: string | null;
  coverImage: string | null;
  primaryColor: string | null;
  wifiName: string | null;
  categories: Category[];
}

export function GuestTemplateClient({ hotel }: { hotel: Hotel }) {
  const [isPending, startTransition] = useTransition();
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  
  const [coverImage, setCoverImage] = useState(hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
  const [primaryColor, setPrimaryColor] = useState(hotel.primaryColor || "#4f46e5");
  
  const [categories, setCategories] = useState(hotel.categories);

  const colors = [
    { hex: "#2563eb", class: "bg-blue-600", name: "Blue" },
    { hex: "#4f46e5", class: "bg-indigo-600", name: "Indigo" },
    { hex: "#e11d48", class: "bg-rose-600", name: "Rose" },
    { hex: "#f97316", class: "bg-orange-500", name: "Orange" },
    { hex: "#10b981", class: "bg-emerald-600", name: "Emerald" },
    { hex: "#8b5cf6", class: "bg-violet-600", name: "Violet" },
  ];

  const updateCategoryEmoji = (categoryId: string, emoji: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, emoji } : cat
    ));
  };

  const updateCategoryBgImage = (categoryId: string, bgImage: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, bgImage } : cat
    ));
  };

  const updateCategoryCustomName = (categoryId: string, customName: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, customName } : cat
    ));
  };

  const toggleCategoryActive = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleSave = async () => {
    setIsSaved(false);
    startTransition(async () => {
      try {
        const result = await updateGuestTemplate({
          hotelId: hotel.id,
          coverImage: coverImage || "",
          primaryColor: primaryColor || "",
          categories: categories.map(cat => ({
            id: cat.id,
            customName: cat.customName || "",
            emoji: cat.emoji || "",
            bgImage: cat.bgImage || "",
            isActive: cat.isActive,
          })),
        });
        
        console.log("Save result:", result);
        setIsSaved(true);
        
        // Reset to "Save Changes" after 2 seconds
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to save:", error);
        setIsSaved(false);
        showTranslatedError("app.toast.error.settings_save_failed");
      }
    });
  };

  const handleImportDemo = () => {
    setIsImportDialogOpen(true);
  };

  const confirmImportDemo = async () => {
    setIsImportDialogOpen(false);
    setIsImporting(true);
    try {
      await importDemoData();
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to import demo data:", error);
      showTranslatedError("app.toast.error.demo_import_failed");
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{translate("app.dashboard.guest_template.title")}</h1>
          <p className="text-gray-500 mt-1">{translate("app.dashboard.guest_template.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={handleImportDemo}
            disabled={isImporting}
            className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 rounded-xl gap-2"
          >
            <Download className="h-4 w-4" />
            {isImporting ? translate("app.dashboard.guest_template.importing") : translate("app.dashboard.guest_template.import_demo_data")}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 rounded-xl gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? translate("app.dashboard.guest_template.hide") : translate("app.dashboard.guest_template.show_preview")}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isPending}
            className={`gap-2 rounded-xl shadow-md transition-all ${
              isSaved 
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                {translate("app.dashboard.guest_template.saved")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isPending ? translate("app.dashboard.guest_template.saving") : translate("app.dashboard.settings.save_changes")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Settings Panel - Left Side (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{translate("app.dashboard.guest_template.cover_image")}</h3>
              <p className="text-sm text-gray-500">{translate("app.dashboard.guest_template.cover_image_desc")}</p>
            </div>

            <div className="grid gap-4">
              <Label htmlFor="coverImage" className="text-gray-700 font-medium">
                {translate("app.dashboard.guest_template.image_url")}
              </Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50"
              />
              <p className="text-xs text-gray-400">
                {translate("app.dashboard.guest_template.recommended_size")}
              </p>
              
              {coverImage && (
                <div className="mt-4 rounded-xl overflow-hidden">
                  <img 
                    src={coverImage} 
                    alt={translate("app.dashboard.guest_template.cover_preview")} 
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{translate("app.dashboard.guest_template.color_scheme")}</h3>
              <p className="text-sm text-gray-500">{translate("app.dashboard.guest_template.color_scheme_desc")}</p>
            </div>

            <div className="grid gap-4">
              <Label className="text-gray-700 font-medium">{translate("app.dashboard.guest_template.primary_color")}</Label>
              <div className="flex gap-4 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setPrimaryColor(color.hex)}
                    className={`h-14 w-14 rounded-2xl shadow-md hover:scale-110 transition-all ${color.class} ${
                      primaryColor === color.hex
                        ? "ring-4 ring-offset-2 ring-indigo-100 scale-110"
                        : ""
                    }`}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Categories Customization */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{translate("app.dashboard.guest_template.categories")}</h3>
              <p className="text-sm text-gray-500">{translate("app.dashboard.guest_template.categories_desc")}</p>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{category.customName || category.name}</h3>
                      <p className="text-xs text-gray-500">{translate("app.dashboard.guest_template.default")}: {category.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.emoji || "🏨"}</span>
                      <button
                        type="button"
                        onClick={() => toggleCategoryActive(category.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          category.isActive ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            category.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-600">{translate("app.dashboard.guest_template.custom_name")}</Label>
                    <Input
                      value={category.customName || ""}
                      onChange={(e) => updateCategoryCustomName(category.id, e.target.value)}
                      placeholder={translate("app.dashboard.guest_template.custom_name_placeholder").replace("{name}", category.name)}
                      className="h-10 rounded-lg bg-gray-50 border-transparent focus:bg-white"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-600">{translate("app.dashboard.guest_template.emoji")}</Label>
                    <Input
                      value={category.emoji || ""}
                      onChange={(e) => updateCategoryEmoji(category.id, e.target.value)}
                      placeholder="🏨"
                      className="h-10 rounded-lg bg-gray-50 border-transparent focus:bg-white"
                      maxLength={2}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-600">{translate("app.dashboard.guest_template.background_image_url")}</Label>
                    <Input
                      value={category.bgImage || ""}
                      onChange={(e) => updateCategoryBgImage(category.id, e.target.value)}
                      placeholder="https://..."
                      className="h-10 rounded-lg bg-gray-50 border-transparent focus:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel - Right Side (8 cols) */}
        {showPreview && (
          <div className="lg:col-span-8 lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 flex items-start justify-center p-8 relative max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 shadow-sm z-10">
                {translate("app.dashboard.guest_template.preview_mode")}
              </div>

              {/* Mobile Preview Frame */}
              <div className="bg-white rounded-2xl overflow-y-auto shadow-2xl w-[360px] h-[600px] transform hover:scale-[1.02] transition-transform duration-500">
                {/* Hero Section */}
                <div className="relative h-64 bg-gray-900">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    <p className="text-xs font-medium opacity-90 mb-0.5">{translate("app.dashboard.guest_template.welcome_to")}</p>
                    <h1 className="text-xl font-bold">{hotel.name}</h1>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                      {translate("app.dashboard.guest_template.room_100")}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">{translate("app.dashboard.guest_template.how_can_help")}</h2>
                  <p className="text-xs text-gray-500 mb-5">{translate("app.dashboard.guest_template.choose_category_desc")}</p>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {categories.filter(c => c.isActive).slice(0, 4).map((category) => (
                      <div 
                        key={category.id}
                        className={`relative flex flex-col items-center justify-center rounded-xl border border-gray-100 shadow-sm text-center overflow-hidden ${
                          category.bgImage ? 'min-h-[100px] h-[100px]' : 'bg-white p-3 min-h-[100px]'
                        }`}
                      >
                        {category.bgImage ? (
                          <>
                            {/* Cover Image */}
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${category.bgImage})` }}
                            />
                            {/* Uniform Overlay */}
                            <div className="absolute inset-0 bg-black/40" />
                            {/* Category Name - Centered */}
                            <div className="relative z-10 flex items-center justify-center h-full w-full px-2">
                              <span className="font-heading font-bold text-white text-sm text-center drop-shadow-2xl">
                                {category.customName || category.name}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-full flex items-center justify-center mb-2.5 bg-gray-100 text-2xl">
                              {category.emoji || "🏨"}
                            </div>
                            <span className="font-heading font-semibold text-gray-900 text-xs leading-tight">{category.customName || category.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Popular Services */}
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{translate("app.dashboard.guest_template.popular_services")}</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-xs">{translate("app.dashboard.guest_template.in_room_breakfast")}</p>
                        <p className="text-xs text-gray-500">{translate("app.dashboard.guest_template.mins")}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">$25.00</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t border-gray-100">
                  {translate("app.dashboard.guest_template.powered_by")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import Demo Data Confirmation Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate("app.dashboard.guest_template.import_demo_data") || "Import Demo Data"}</DialogTitle>
            <DialogDescription>
              {translate("app.dashboard.guest_template.import_demo_warning") || "This will import demo data and overwrite your current settings. Continue?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              {translate("app.dashboard.requests.cancel")}
            </Button>
            <Button onClick={confirmImportDemo} disabled={isImporting}>
              {isImporting ? translate("app.dashboard.guest_template.importing") : translate("app.dashboard.guest_template.import_demo_data")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
