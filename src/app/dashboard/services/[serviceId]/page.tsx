import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  // Mock data - in real app, fetch from DB
  const service = {
    id: serviceId,
    name: "Club Sandwich",
    description: "Triple-decker sandwich with roasted chicken breast",
    price: "18.00",
    category: "Room Service",
    estimatedTime: "20-30 min",
    isActive: true,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Edit Service</h1>
      </div>

      {/* Form Grid */}
      <form className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Service Name</Label>
              <Input 
                id="name" 
                defaultValue={service.name}
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                defaultValue={service.description}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
              <select
                id="category"
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                defaultValue={service.category}
              >
                <option>Room Service</option>
                <option>Housekeeping</option>
                <option>Spa & Wellness</option>
                <option>Transport</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Pricing & Details</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price (USD)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                defaultValue={service.price}
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime" className="text-sm font-semibold text-gray-700">Estimated Time</Label>
              <Input 
                id="estimatedTime" 
                defaultValue={service.estimatedTime}
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Status</Label>
              <div className="pt-1">
                <Badge 
                  variant={service.isActive ? "default" : "secondary"}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Link href="/dashboard/services">
          <Button variant="outline" className="rounded-xl h-11 px-6 border-gray-200 hover:bg-gray-50">
            Cancel
          </Button>
        </Link>
        <Button className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}

