"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save, Star } from "lucide-react";
import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardPageLoading } from "@/components/dashboard/DashboardPageLoading";

export default function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; parentId: string | null }>
  >([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    estimatedTime: "",
    isActive: true,
    isFeatured: false,
    requirePayment: false,
  });
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );
  const leafCategoryOptions = useMemo(() => {
    const parentIds = new Set(
      categories.filter((category) => category.parentId).map((category) => category.parentId)
    );
    return categories
      .filter((category) => !parentIds.has(category.id))
      .map((category) => {
        const parent = category.parentId ? categoryById.get(category.parentId) : null;
        return {
          id: category.id,
          name: parent ? `${parent.name} / ${category.name}` : category.name,
        };
      });
  }, [categories, categoryById]);

  useEffect(() => {
    async function init() {
      setIsInitialLoading(true);
      try {
        const [serviceRes, categoriesRes, hotelRes] = await Promise.all([
          fetch(`/api/services/${serviceId}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/hotel", { cache: "no-store" }),
        ]);
        const serviceData = await serviceRes.json();
        const categoriesData = await categoriesRes.json();
        const hotelData = await hotelRes.json();
        const service = serviceData.service;
        setCategories(categoriesData.categories ?? []);
        setPaymentsEnabled(Boolean(hotelData?.hotel?.paymentsEnabled));

        if (service) {
          setForm({
            name: service.name ?? "",
            description: service.description ?? "",
            categoryId: service.categoryId ?? "",
            price: service.price ?? "",
            estimatedTime: service.estimatedTime ?? "",
            isActive: Boolean(service.isActive),
            isFeatured: Boolean(service.isFeatured),
            requirePayment: Boolean(service.requirePayment),
          });
        }
      } finally {
        setIsInitialLoading(false);
      }
    }
    init();
  }, [serviceId]);

  async function saveChanges() {
    await fetch(`/api/services/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: form.price ? Number(form.price) : null,
      }),
    });
  }

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <DashboardPageLoading variant="form" />
      ) : (
        <>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="icon" className="rounded-md">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <DashboardPageHeader
          eyebrow="Hotel · menu"
          title="Edit service"
          description="Update name, category, pricing, and availability."
        />
      </div>

      <form className="grid gap-6 md:grid-cols-2">
        <Card className="card-surface border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="bg-surface border-[color:var(--border)]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-[color:var(--border)] bg-surface px-3 py-2 text-sm"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
              >
                <option value="">Select category</option>
                {leafCategoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card-surface border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">Pricing & status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, price: event.target.value }))
                }
                className="bg-surface border-[color:var(--border)]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated time</Label>
              <Input
                id="estimatedTime"
                value={form.estimatedTime}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, estimatedTime: event.target.value }))
                }
                className="bg-surface border-[color:var(--border)]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.isActive ? "active" : "inactive"}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: event.target.value === "active",
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-surface p-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: event.target.checked,
                    }))
                  }
                />
                <span className="leading-tight">
                  <span className="text-sm text-ink font-medium inline-flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-brand fill-amber-brand" />
                    Featured upsell
                  </span>
                  <span className="block text-[11px] text-foreground/60 mt-0.5">
                    Appears as the green daily recommendation on every guest&apos;s
                    home screen. Mark several services to rotate them randomly.
                  </span>
                </span>
              </label>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-surface p-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
                  checked={form.requirePayment}
                  disabled={!paymentsEnabled}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      requirePayment: event.target.checked,
                    }))
                  }
                />
                <span className="leading-tight">
                  <span className="block text-sm text-ink font-medium">
                    Require payment
                  </span>
                  <span className="block text-[11px] text-foreground/60 mt-0.5">
                    {paymentsEnabled
                      ? "Guests will pay before the request reaches staff."
                      : "Enable payments in Settings → Payments to use this."}
                  </span>
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="flex justify-end gap-3">
        <Link href="/dashboard/services">
          <Button variant="outline" className="rounded-md">
            Cancel
          </Button>
        </Link>
        <Button type="button" onClick={saveChanges} className="bg-primary hover:bg-primary/90 rounded-md gap-2">
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
        </>
      )}
    </div>
  );
}
