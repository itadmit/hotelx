"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateService } from "@/app/actions/hotel";
import { useToast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceEditorFormProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    price: any;
    estimatedTime: string | null;
    isActive: boolean;
  };
  categories: Array<{ id: string; name: string }>;
}

export function ServiceEditorForm({ service, categories }: ServiceEditorFormProps) {
  const router = useRouter();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const { translate } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(service.name || "");
  const [description, setDescription] = useState(service.description || "");
  const [categoryId, setCategoryId] = useState(service.categoryId || "");
  const [price, setPrice] = useState(service.price ? String(service.price) : "");
  const [estimatedTime, setEstimatedTime] = useState(service.estimatedTime || "");
  const [isActive, setIsActive] = useState(service.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("price", price);
        formData.append("estimatedTime", estimatedTime);
        formData.append("isActive", String(isActive));

        await updateService(service.id, formData);
        showTranslatedSuccess("app.toast.success.service_updated");
        router.push("/dashboard/services");
        router.refresh();
      } catch (error) {
        console.error("Failed to update service:", error);
        showTranslatedError("app.toast.error.service_update_failed");
      }
    });
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
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Service Name</Label>
              <Input 
                id="name" 
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-sm font-semibold text-gray-700">Category</Label>
              <Select 
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
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
                name="price"
                type="number" 
                step="0.01" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime" className="text-sm font-semibold text-gray-700">Estimated Time</Label>
              <Input 
                id="estimatedTime" 
                name="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Status</Label>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="inline-flex items-center"
                >
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 lg:col-span-2">
          <Link href="/dashboard/services">
            <Button type="button" variant="outline" className="rounded-xl h-11 px-6 border-gray-200 hover:bg-gray-50">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending} className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
            <Save className="mr-2 h-4 w-4" /> {isPending ? translate("app.dashboard.common.saving") : translate("app.dashboard.requests.save_changes")}
          </Button>
        </div>
      </form>
    </div>
  );
}

