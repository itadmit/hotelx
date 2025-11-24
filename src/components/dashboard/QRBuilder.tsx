"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Printer, Copy, ArrowRight, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QRBuilderProps {
  hotelSlug: string;
  hotelName: string;
  wifiName: string;
  baseUrl: string;
}

export function QRBuilder({ hotelSlug, hotelName, wifiName: initialWifiName, baseUrl }: QRBuilderProps) {
  const { translate } = useLanguage();
  const [themeColor, setThemeColor] = useState("bg-indigo-600");
  const [instructionText, setInstructionText] = useState("Scan to order services");
  const [logoUrl, setLogoUrl] = useState("");
  const [wifiName, setWifiName] = useState(initialWifiName);
  const [qrValue, setQrValue] = useState("");

  // Colors map to hex for the QR code foreground if needed, 
  // or we just use black for better scanning and use the theme for the flyer.
  // For now, we'll stick to black QR on white background for reliability.
  
  useEffect(() => {
    // Example room code, in real usage this might be dynamic or a template
    const exampleRoomCode = "305"; 
    // Construct the URL: https://domain.com/g/hotel-slug/room-code
    const url = `${baseUrl}/g/${hotelSlug}/${exampleRoomCode}`;
    setQrValue(url);
  }, [baseUrl, hotelSlug]);

  useEffect(() => {
    setWifiName(initialWifiName);
  }, [initialWifiName]);

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-${hotelSlug}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Settings - Left Side (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Design Customization</h3>
            <p className="text-sm text-gray-500">Customize your flyer appearance</p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-gray-700">Theme Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { class: 'bg-blue-600', hex: '#2563eb' },
                  { class: 'bg-indigo-600', hex: '#4f46e5' },
                  { class: 'bg-rose-600', hex: '#e11d48' },
                  { class: 'bg-orange-500', hex: '#f97316' },
                  { class: 'bg-black', hex: '#000000' }
                ].map((color, i) => (
                  <div 
                    key={i} 
                    onClick={() => setThemeColor(color.class)}
                    className={`h-8 w-8 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform ${color.class} ${themeColor === color.class ? 'ring-4 ring-offset-2 ring-indigo-100' : ''}`}
                  >
                    {themeColor === color.class && <Check className="h-4 w-4 text-white m-auto mt-2" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-gray-700">Instruction Text</Label>
              <Input 
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                className="rounded-xl bg-gray-50 border-transparent focus:bg-white" 
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-700">Logo URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..." 
                  className="rounded-xl bg-gray-50 border-transparent focus:bg-white" 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-700">WiFi Network Name</Label>
              <Input 
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                placeholder="e.g. HotelX_Guest" 
                className="rounded-xl bg-gray-50 border-transparent focus:bg-white" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Export</h3>
          </div>
          <div className="space-y-2">
            <Button onClick={handleDownload} className="w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200" size="lg">
              <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Download PNG</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Button>
            <Button className="w-full justify-start text-gray-600 hover:bg-gray-50 rounded-xl" variant="ghost">
              <Printer className="mr-2 h-4 w-4" /> Print PDF (All Rooms)
            </Button>
            <Button className="w-full justify-start text-gray-600 hover:bg-gray-50 rounded-xl" variant="ghost">
              <Copy className="mr-2 h-4 w-4" /> Copy Link
            </Button>
          </div>
        </div>
      </div>

      {/* Preview - Right Side (8 cols) */}
      <div className="lg:col-span-8">
        <div className="bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 h-full min-h-[600px] flex items-center justify-center p-8 relative">
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 shadow-sm">
            Preview Mode
          </div>

          {/* The Flyer Preview */}
          <div className="w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            <div className={`h-2 ${themeColor} w-full`}></div>
            <div className="p-8 flex flex-col items-center text-center">
              {logoUrl ? (
                <img src={logoUrl} alt={translate("app.dashboard.common.hotel_logo")} className="w-16 h-16 object-contain mb-6" />
              ) : (
                <div className={`w-16 h-16 ${themeColor} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg`}>
                  {hotelName.charAt(0) || "H"}
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {hotelName}</h2>
              <p className="text-gray-500 mb-8">We're glad to have you here.</p>

              <div className="bg-gray-900 p-4 rounded-2xl shadow-inner mb-8">
                <div className="bg-white p-2 rounded-xl">
                  {qrValue && (
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={qrValue}
                      size={160}
                      level={"H"}
                      includeMargin={true}
                    />
                  )}
                </div>
              </div>

              <p className={`text-sm font-medium uppercase tracking-wider mb-2`} style={{ color: 'var(--theme-color)' }}>
                {instructionText}
              </p>
              
              <div className="w-full h-px bg-gray-100 my-6"></div>

              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase font-bold">Room</p>
                  <p className="text-xl font-bold text-gray-900">305</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold">WiFi</p>
                  <p className="text-sm font-bold text-gray-900">{wifiName}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
              Powered by <span className="font-heading">Hotel<span className="text-indigo-600">X</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

