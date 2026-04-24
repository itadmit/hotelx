"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ServiceImageField } from "@/components/dashboard/ServiceImageField";
import { Loader2, Save, Star, Trash2 } from "lucide-react";
import Link from "next/link";

type CategoryRow = {
  id: string;
  name: string;
  parentId: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string | null;
  categories: CategoryRow[];
  onSaved: () => void | Promise<void>;
};

export function ServiceEditModal({
  open,
  onOpenChange,
  serviceId,
  categories,
  onSaved,
}: Props) {
  const rid = useId();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    estimatedTime: "",
    isActive: true,
    isFeatured: false,
    requirePayment: false,
    image: null as string | null,
  });

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const leafCategoryOptions = useMemo(() => {
    const parentIds = new Set(
      categories.filter((c) => c.parentId).map((c) => c.parentId)
    );
    return categories
      .filter((c) => !parentIds.has(c.id))
      .map((c) => {
        const parent = c.parentId ? categoryById.get(c.parentId) : null;
        return {
          id: c.id,
          name: parent ? `${parent.name} / ${c.name}` : c.name,
        };
      });
  }, [categories, categoryById]);

  const loadService = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    setSaveError(null);
    try {
      const [serviceRes, hotelRes] = await Promise.all([
        fetch(`/api/services/${serviceId}`, { cache: "no-store" }),
        fetch("/api/hotel", { cache: "no-store" }),
      ]);
      const serviceData = await serviceRes.json();
      const hotelData = await hotelRes.json();
      const service = serviceData.service;
      setPaymentsEnabled(Boolean(hotelData?.hotel?.paymentsEnabled));
      if (service) {
        setForm({
          name: service.name ?? "",
          description: service.description ?? "",
          categoryId: service.categoryId ?? "",
          price: service.price != null ? String(service.price) : "",
          estimatedTime: service.estimatedTime ?? "",
          isActive: Boolean(service.isActive),
          isFeatured: Boolean(service.isFeatured),
          requirePayment: Boolean(service.requirePayment),
          image: typeof service.image === "string" ? service.image : null,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (open && serviceId) {
      void loadService();
    }
  }, [open, serviceId, loadService]);

  async function handleDelete() {
    if (!serviceId) return;
    const serviceName = form.name.trim() || "this service";
    const ok = window.confirm(
      `Delete “${serviceName}”? This can't be undone.`
    );
    if (!ok) return;
    setDeleting(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(
          typeof data.error === "string" ? data.error : "Could not delete service"
        );
        return;
      }
      await onSaved();
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    if (!serviceId) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          image: form.image,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(
          typeof data.error === "string" ? data.error : "Could not save changes"
        );
        return;
      }
      await onSaved();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[min(90vh,720px)] flex flex-col p-0 gap-0 rounded-xl border-[color:var(--border)] bg-card"
        bodyClassName="flex flex-col flex-1 min-h-0"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-[color:var(--border)] shrink-0">
          <DialogTitle className="font-display text-lg tracking-tight">
            Edit service
          </DialogTitle>
          <DialogDescription className="text-foreground/55 text-sm">
            Quick edits apply immediately after save. For a larger layout, use
            the full editor.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-foreground/50 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-brand" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <>
              <ServiceImageField
                value={form.image}
                onChange={(image) => setForm((prev) => ({ ...prev, image }))}
              />
              <div className="grid gap-2">
                <Label htmlFor={`${rid}-name`}>Name</Label>
                <Input
                  id={`${rid}-name`}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-10 rounded-xl bg-surface border-[color:var(--border)]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${rid}-description`}>Description</Label>
                <textarea
                  id={`${rid}-description`}
                  className="flex min-h-[88px] w-full rounded-xl border border-[color:var(--border)] bg-surface px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${rid}-category`}>Category</Label>
                <Select
                  id={`${rid}-category`}
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                >
                  <option value="">Select category</option>
                  {leafCategoryOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor={`${rid}-price`}>Price</Label>
                  <Input
                    id={`${rid}-price`}
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="h-10 rounded-xl bg-surface border-[color:var(--border)]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${rid}-time`}>Est. time</Label>
                  <Input
                    id={`${rid}-time`}
                    value={form.estimatedTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        estimatedTime: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl bg-surface border-[color:var(--border)]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${rid}-status`}>Status</Label>
                <Select
                  id={`${rid}-status`}
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.value === "active",
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
              <div className="rounded-xl border border-[color:var(--border)] bg-surface p-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                  />
                  <span className="leading-tight">
                    <span className="text-sm text-ink font-medium inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-amber-brand fill-amber-brand" />
                      Featured upsell
                    </span>
                    <span className="block text-[11px] text-foreground/60 mt-0.5">
                      Guest home green recommendation tile.
                    </span>
                  </span>
                </label>
              </div>
              <div className="rounded-xl border border-[color:var(--border)] bg-surface p-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
                    checked={form.requirePayment}
                    disabled={!paymentsEnabled}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        requirePayment: e.target.checked,
                      }))
                    }
                  />
                  <span className="leading-tight">
                    <span className="block text-sm text-ink font-medium">
                      Require payment
                    </span>
                    <span className="block text-[11px] text-foreground/60 mt-0.5">
                      {paymentsEnabled
                        ? "Guests pay before staff sees the request."
                        : "Enable in Settings → Payments."}
                    </span>
                  </span>
                </label>
              </div>
              {serviceId ? (
                <p className="text-center pt-1">
                  <Link
                    href={`/dashboard/services/${serviceId}`}
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Open full-page editor →
                  </Link>
                </p>
              ) : null}
            </>
          )}
        </div>

        <DialogFooter className="px-5 py-4 border-t border-[color:var(--border)] shrink-0 flex-col sm:flex-row sm:items-center gap-2">
          {serviceId ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl gap-2 text-clay hover:text-clay hover:bg-clay/10 sm:mr-auto w-full sm:w-auto"
              disabled={loading || saving || deleting}
              onClick={() => void handleDelete()}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          ) : null}
          {saveError ? (
            <p className="text-xs text-clay w-full sm:flex-1 sm:text-left">
              {saveError}
            </p>
          ) : null}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl flex-1 sm:flex-none border-[color:var(--border)]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90"
              disabled={loading || saving || deleting || !form.name.trim() || !form.categoryId}
              onClick={() => void handleSave()}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
