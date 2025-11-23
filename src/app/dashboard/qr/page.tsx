import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Printer, Copy, ArrowRight } from "lucide-react";

export default function QRPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QR Code Generator</h1>
          <p className="text-gray-500 mt-1">Create digital access points for your rooms</p>
        </div>
      </div>

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
                      {['bg-blue-600', 'bg-indigo-600', 'bg-rose-600', 'bg-orange-500', 'bg-black'].map((color, i) => (
                         <div key={i} className={`h-8 w-8 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform ${color} ${i === 0 ? 'ring-4 ring-offset-2 ring-indigo-100' : ''}`}></div>
                      ))}
                   </div>
                </div>
                
                <div className="grid gap-2">
                   <Label className="text-gray-700">Instruction Text</Label>
                   <Input defaultValue="Scan to order services" className="rounded-xl bg-gray-50 border-transparent focus:bg-white" />
                </div>

                <div className="grid gap-2">
                   <Label className="text-gray-700">Logo URL</Label>
                   <div className="flex gap-2">
                      <Input placeholder="https://..." className="rounded-xl bg-gray-50 border-transparent focus:bg-white" />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
             <div>
                <h3 className="font-bold text-gray-900 mb-1">Export</h3>
             </div>
             <div className="space-y-2">
                <Button className="w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200" size="lg">
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
                <div className="h-2 bg-indigo-600 w-full"></div>
                <div className="p-8 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-indigo-200">
                      H
                   </div>
                   
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HotelX</h2>
                   <p className="text-gray-500 mb-8">We're glad to have you here.</p>

                   <div className="bg-gray-900 p-4 rounded-2xl shadow-inner mb-8">
                      <div className="bg-white p-2 rounded-xl">
                         <QrCode className="h-40 w-40 text-gray-900" />
                      </div>
                   </div>

                   <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">Scan to access services</p>
                   
                   <div className="w-full h-px bg-gray-100 my-6"></div>

                   <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                         <p className="text-xs text-gray-400 uppercase font-bold">Room</p>
                         <p className="text-xl font-bold text-gray-900">305</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-400 uppercase font-bold">WiFi</p>
                         <p className="text-sm font-bold text-gray-900">HotelX_Guest</p>
                      </div>
                   </div>
                </div>
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                   Powered by HotelX
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}