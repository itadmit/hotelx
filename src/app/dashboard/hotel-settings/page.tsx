"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Globe, Palette, Building2, Save, Trash2 } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { cn } from "@/lib/utils";

export default function HotelSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [primaryColor, setPrimaryColor] = useState("#0e5240");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadHotel() {
    const response = await fetch("/api/hotel", { cache: "no-store" });
    const data = await response.json();
    if (data.hotel) {
      setName(data.hotel.name ?? "");
      setLogo(data.hotel.logo ?? "");
      setPrimaryColor(data.hotel.primaryColor ?? "#0e5240");
    }
  }

  useEffect(() => {
    loadHotel();
  }, []);

  async function saveSettings() {
    setSaving(true);
    await fetch("/api/hotel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        logo: logo || null,
        primaryColor,
      }),
    });
    setSaving(false);
  }

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navBtn = (id: string, label: string, Icon: typeof Building2) => (
    <button
      type="button"
      onClick={() => scrollToSection(id)}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-3 transition-colors",
        activeTab === id
          ? "bg-background text-ink font-medium border border-[color:var(--border)]"
          : "text-foreground/60 hover:bg-background/80 hover:text-ink"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" /> {label}
    </button>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 border-b border-[color:var(--border)] sm:border-0">
        <DashboardPageHeader
          eyebrow="Workspace · identity"
          title="Hotel settings"
          description="Name, branding, and guest-facing preferences for your property."
        >
          <Button variant="outline" onClick={loadHotel} className="h-9 text-xs rounded-md">
            Discard
          </Button>
          <Button
            onClick={saveSettings}
            className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90 rounded-md"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </DashboardPageHeader>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1 space-y-4 lg:sticky lg:top-28">
          <div className="card-surface p-2">
            <nav className="space-y-0.5">
              {navBtn("general", "General", Building2)}
              {navBtn("branding", "Branding", Palette)}
              {navBtn("localization", "Localization", Globe)}
            </nav>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div id="general" className="card-surface p-6 lg:p-8 space-y-6 scroll-mt-28">
            <div>
              <h3 className="font-display text-lg text-ink">Basic information</h3>
              <p className="text-sm text-foreground/55 mt-0.5">Shown to guests where your hotel name appears.</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="hotelName">Hotel name</Label>
                <Input
                  id="hotelName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="bg-surface border-[color:var(--border)] rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-dashed border-[color:var(--border)] rounded-[var(--radius)] bg-surface/50">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary font-display text-lg border border-[color:var(--border)]">
                    {name ? name.slice(0, 2).toUpperCase() : "HX"}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <Button variant="outline" size="sm" type="button" className="rounded-md">
                      <Upload className="mr-2 h-4 w-4" /> Upload
                    </Button>
                    <Input
                      placeholder="Logo URL"
                      value={logo}
                      onChange={(event) => setLogo(event.target.value)}
                      className="h-9"
                    />
                    <p className="text-xs text-foreground/45">PNG or JPG, square works best.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="branding" className="card-surface p-6 lg:p-8 space-y-6 scroll-mt-28">
            <div>
              <h3 className="font-display text-lg text-ink">Branding</h3>
              <p className="text-sm text-foreground/55 mt-0.5">Accent color for guest touchpoints (stored per hotel).</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-2">
                <Label>Primary color</Label>
                <div className="flex gap-2 flex-wrap">
                  {["#0e5240", "#b96b2a", "#b8543d", "#15201c", "#2563eb"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPrimaryColor(color)}
                      style={{ backgroundColor: color }}
                      className={cn(
                        "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                        primaryColor === color
                          ? "ring-2 ring-offset-2 ring-primary border-background"
                          : "border-white/20"
                      )}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="font">Font (preview)</Label>
                <select
                  id="font"
                  className="flex h-10 w-full rounded-md border border-[color:var(--border)] bg-surface px-3 py-2 text-sm"
                >
                  <option>Manrope</option>
                  <option>Fraunces + Manrope</option>
                  <option>System UI</option>
                </select>
              </div>
            </div>
          </div>

          <div id="localization" className="card-surface p-6 lg:p-8 space-y-6 scroll-mt-28">
            <div>
              <h3 className="font-display text-lg text-ink">Localization</h3>
              <p className="text-sm text-foreground/55 mt-0.5">Default language and currency for quotes.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="language">Default language</Label>
                <select
                  id="language"
                  className="flex h-10 w-full rounded-md border border-[color:var(--border)] bg-surface px-3 py-2 text-sm"
                >
                  <option>English</option>
                  <option>Hebrew</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="flex h-10 w-full rounded-md border border-[color:var(--border)] bg-surface px-3 py-2 text-sm"
                >
                  <option>USD ($)</option>
                  <option>ILS (₪)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-surface p-6 lg:p-8 border border-clay/25 bg-clay/5 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg text-clay">Danger zone</h3>
                <p className="text-sm text-foreground/60 mt-0.5">Irreversible actions for this workspace.</p>
              </div>
              <Button
                variant="ghost"
                className="text-clay hover:text-clay hover:bg-clay/10 rounded-md gap-2 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
