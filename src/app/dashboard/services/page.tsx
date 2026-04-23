"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ServicesPageSkeleton } from "@/components/dashboard/ServicesPageSkeleton";
import { CategoryIconPicker } from "@/components/dashboard/CategoryIconPicker";
import { resolveCategoryIcon } from "@/lib/category-icons";
import { Search, Plus, MoreHorizontal, Filter, Clock, DollarSign, Star, Info, Palette } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import Link from "next/link";

export default function ServicesPage() {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<"all" | "active" | "inactive">("all");
  const [services, setServices] = useState<
    Array<{
      id: string;
      name: string;
      categoryId: string;
      description: string | null;
      price: string | null;
      estimatedTime: string | null;
      isActive: boolean;
      isFeatured: boolean;
      category: { id: string; name: string };
    }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      parentId: string | null;
      icon: string | null;
    }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    categoryId: "",
    price: "",
    estimatedTime: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    parentId: "",
    icon: "Utensils",
  });
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [categoryIconPickerOpen, setCategoryIconPickerOpen] = useState(false);
  const [categoryIconPickerTarget, setCategoryIconPickerTarget] = useState<
    "new" | string | null
  >(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  async function loadData(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) {
      setIsInitialLoading(true);
    }
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch("/api/services", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const servicesData = await servicesRes.json();
      const categoriesData = await categoriesRes.json();
      setServices(servicesData.services ?? []);
      setCategories(categoriesData.categories ?? []);
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData({ initial: true });
  }, []);

  async function createService() {
    if (!newService.name || !newService.categoryId) return;
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newService,
        price: newService.price ? Number(newService.price) : null,
      }),
    });
    setNewService({
      name: "",
      categoryId: "",
      price: "",
      estimatedTime: "",
      description: "",
    });
    setIsAddServiceOpen(false);
    await loadData();
  }

  async function toggleFeatured(serviceId: string, next: boolean) {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isFeatured: next } : s))
    );
    try {
      await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: next }),
      });
    } catch {
      // Roll back if the request failed.
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, isFeatured: !next } : s))
      );
    }
  }

  async function createCategory() {
    const name = newCategory.name.trim();
    if (!name) return;
    const slugSource = newCategory.slug.trim() || name;
    const slug = slugSource
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) return;

    setCategoryFormError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        icon: newCategory.icon,
        parentId: newCategory.parentId ? newCategory.parentId : null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setCategoryFormError(
        typeof data.error === "string" ? data.error : "Could not create category"
      );
      return;
    }

    setNewCategory({ name: "", slug: "", parentId: "", icon: "Utensils" });
    setIsAddCategoryOpen(false);
    await loadData();
  }

  async function patchCategoryIcon(categoryId: string, icon: string) {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon }),
    });
    if (!res.ok) return;
    await loadData();
  }

  const filteredServices = useMemo(() => {
    const text = search.trim().toLowerCase();
    return services.filter((service) => {
      const categoryMatch =
        selectedCategory === "all" || service.categoryId === selectedCategory;
      const activityMatch =
        activityFilter === "all" ||
        (activityFilter === "active" && service.isActive) ||
        (activityFilter === "inactive" && !service.isActive);
      const textMatch =
        !text ||
        service.name.toLowerCase().includes(text) ||
        service.category.name.toLowerCase().includes(text);
      return categoryMatch && activityMatch && textMatch;
    });
  }, [services, search, selectedCategory, activityFilter]);

  const activeCount = useMemo(
    () => services.filter((s) => s.isActive).length,
    [services]
  );
  const featuredCount = useMemo(
    () => services.filter((s) => s.isFeatured).length,
    [services]
  );

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );
  const rootCategories = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories]
  );
  const leafCategories = useMemo(() => {
    const parentIds = new Set(
      categories.filter((category) => category.parentId).map((category) => category.parentId)
    );
    return categories.filter((category) => !parentIds.has(category.id));
  }, [categories]);
  const categoryOptions = useMemo(() => {
    return leafCategories.map((category) => {
      const parent = category.parentId ? categoriesById.get(category.parentId) : null;
      return {
        id: category.id,
        name: parent ? `${parent.name} / ${category.name}` : category.name,
      };
    });
  }, [leafCategories, categoriesById]);

  function toggleActivityFilter() {
    setActivityFilter((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  }

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <ServicesPageSkeleton />
      ) : (
        <>
      <DashboardPageHeader
        eyebrow="Hotel · menu"
        title="Services & menu"
        description="Everything guests can order — synced with categories and pricing."
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setNewCategory({
                name: "",
                slug: "",
                parentId: "",
                icon: "Utensils",
              });
              setCategoryFormError(null);
              setIsAddCategoryOpen(true);
            }}
            variant="outline"
            className="gap-2 h-9 text-xs rounded-md"
          >
            <Plus className="h-3.5 w-3.5" />
            Add category
          </Button>
          <Button
            onClick={() => setIsAddServiceOpen(true)}
            className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90 rounded-md"
          >
            <Plus className="h-3.5 w-3.5" />
            Add service
          </Button>
        </div>
      </DashboardPageHeader>

      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add service</DialogTitle>
            <DialogDescription>Create a new service or menu item for guests.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Club sandwich"
                value={newService.name}
                onChange={(event) =>
                  setNewService((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={newService.categoryId}
                onChange={(event) =>
                  setNewService((prev) => ({ ...prev, categoryId: event.target.value }))
                }
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  placeholder="0.00"
                  value={newService.price}
                  onChange={(event) =>
                    setNewService((prev) => ({ ...prev, price: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Est. time</Label>
                <Input
                  placeholder="e.g. 20 min"
                  value={newService.estimatedTime}
                  onChange={(event) =>
                    setNewService((prev) => ({
                      ...prev,
                      estimatedTime: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input
                placeholder="Short description…"
                value={newService.description}
                onChange={(event) =>
                  setNewService((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createService}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddCategoryOpen}
        onOpenChange={(open) => {
          setIsAddCategoryOpen(open);
          if (!open) setCategoryFormError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>
              Create a top-level category or a room-service subcategory. Icons appear
              on the guest concierge home.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {categoryFormError ? (
              <p className="text-sm text-clay bg-amber-soft/40 border border-[color:var(--border)] rounded-lg px-3 py-2">
                {categoryFormError}
              </p>
            ) : null}
            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryIconPickerTarget("new");
                    setCategoryIconPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-[color:var(--border)] bg-surface hover:bg-background text-ink text-sm transition-colors"
                >
                  {(() => {
                    const Icon = resolveCategoryIcon(newCategory.icon);
                    return <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />;
                  })()}
                  <span className="font-mono text-xs text-foreground/60">
                    {newCategory.icon}
                  </span>
                  <Palette className="h-3.5 w-3.5 text-foreground/40 ml-1" />
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Desserts"
                value={newCategory.name}
                onChange={(event) =>
                  setNewCategory((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Slug (optional)</Label>
              <Input
                placeholder="e.g. room-desserts"
                value={newCategory.slug}
                onChange={(event) =>
                  setNewCategory((prev) => ({ ...prev, slug: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Parent category (optional)</Label>
              <Select
                value={newCategory.parentId}
                onChange={(event) =>
                  setNewCategory((prev) => ({ ...prev, parentId: event.target.value }))
                }
              >
                <option value="">Top-level category</option>
                {rootCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCategory}>Create category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryIconPicker
        open={categoryIconPickerOpen}
        onOpenChange={(open) => {
          setCategoryIconPickerOpen(open);
          if (!open) setCategoryIconPickerTarget(null);
        }}
        value={
          categoryIconPickerTarget === "new"
            ? newCategory.icon
            : categoryIconPickerTarget
              ? categories.find((c) => c.id === categoryIconPickerTarget)?.icon ??
                "Info"
              : "Info"
        }
        onChange={(key) => {
          if (categoryIconPickerTarget === "new") {
            setNewCategory((prev) => ({ ...prev, icon: key }));
          } else if (categoryIconPickerTarget) {
            void patchCategoryIcon(categoryIconPickerTarget, key);
          }
        }}
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
        <div className="card-surface p-5 space-y-6 lg:sticky lg:top-24">
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 px-1 mb-2">
              Categories
            </h3>
            <nav className="space-y-0.5">
              {[{ id: "all", name: "All services", icon: null as string | null }, ...categories].map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-stretch gap-0.5 rounded-md transition-colors ${
                    selectedCategory === cat.id ? "bg-background/50" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? "text-ink font-medium"
                        : "text-foreground/60 hover:bg-background/80 hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{cat.name}</span>
                      {selectedCategory === cat.id && (
                        <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                          {filteredServices.length}
                        </span>
                      )}
                    </div>
                  </button>
                  {cat.id !== "all" ? (
                    <button
                      type="button"
                      aria-label={`Change icon for ${cat.name}`}
                      title="Change icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCategoryIconPickerTarget(cat.id);
                        setCategoryIconPickerOpen(true);
                      }}
                      className="shrink-0 w-9 flex items-center justify-center rounded-md border border-transparent hover:border-[color:var(--border)] hover:bg-surface text-foreground/50 hover:text-ink transition-colors"
                    >
                      {(() => {
                        const Icon = resolveCategoryIcon(cat.icon);
                        return <Icon className="h-3.5 w-3.5" strokeWidth={2} />;
                      })()}
                    </button>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t border-[color:var(--border)]">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 px-1 mb-3">
              Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface p-3 rounded-md border border-[color:var(--border)]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-1">
                  Active
                </div>
                <div className="numeral text-xl text-ink">{activeCount}</div>
              </div>
              <div className="bg-surface p-3 rounded-md border border-[color:var(--border)]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-1">
                  Categories
                </div>
                <div className="numeral text-xl text-ink">{categories.length}</div>
              </div>
              <div className="bg-surface p-3 rounded-md border border-[color:var(--border)] col-span-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-1 inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-brand fill-amber-brand" />
                    Featured upsells
                  </div>
                  <div className="numeral text-xl text-ink">{featuredCount}</div>
                </div>
                <InfoTooltip
                  content={
                    <>
                      Featured services rotate randomly as the green daily
                      recommendation on the guest home screen. Star at least one
                      to enable.
                    </>
                  }
                  side="left"
                >
                  <span className="text-foreground/40 hover:text-foreground/70">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </InfoTooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 min-w-0">
          <div className="card-surface p-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input
                placeholder="Search services, food, amenities…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10 border-transparent bg-transparent rounded-md"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={toggleActivityFilter}
              className="text-foreground/55 rounded-md gap-2 shrink-0"
            >
              <Filter className="h-4 w-4" />
              {activityFilter === "all"
                ? "Filter: all"
                : activityFilter === "active"
                  ? "Filter: active"
                  : "Filter: inactive"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`group card-surface p-5 border transition-colors relative ${
                  service.isFeatured
                    ? "border-amber-brand/40 bg-amber-soft/30"
                    : "border-[color:var(--border)] hover:border-primary/20"
                }`}
              >
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <InfoTooltip
                    content={
                      service.isFeatured
                        ? "Featured upsell — appears as the green daily recommendation on the guest home screen. Click to remove."
                        : "Click to feature this as the green daily recommendation. If multiple are starred, they rotate randomly."
                    }
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFeatured(service.id, !service.isFeatured);
                      }}
                      aria-pressed={service.isFeatured}
                      aria-label={service.isFeatured ? "Unstar" : "Star as featured"}
                      className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
                        service.isFeatured
                          ? "text-amber-brand bg-amber-soft hover:bg-amber-soft/80"
                          : "text-foreground/40 hover:text-amber-brand hover:bg-amber-soft/40"
                      }`}
                    >
                      <Star
                        className="h-4 w-4"
                        strokeWidth={2}
                        fill={service.isFeatured ? "currentColor" : "none"}
                      />
                    </button>
                  </InfoTooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-md flex items-center justify-center bg-primary/10 text-primary shrink-0">
                    <MoreHorizontal className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-lg text-ink truncate">{service.name}</h3>
                    <p className="text-sm text-foreground/55">{service.category.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-[color:var(--border)]">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <DollarSign className="h-4 w-4 text-foreground/40" />
                    <span className="font-medium">{service.price ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock className="h-4 w-4 text-foreground/40" />
                    <span>{service.estimatedTime ?? "—"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge
                    className={
                      service.isActive
                        ? "bg-primary/10 text-primary border-0 rounded-md"
                        : "bg-surface text-foreground/50 border border-[color:var(--border)] rounded-md"
                    }
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Link
                    href={`/dashboard/services/${service.id}`}
                    className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setIsAddServiceOpen(true)}
              className="card-surface border-2 border-dashed border-[color:var(--border)] p-6 flex flex-col items-center justify-center gap-2 text-foreground/45 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors min-h-[200px] rounded-[var(--radius)]"
            >
              <div className="h-11 w-11 rounded-full bg-surface flex items-center justify-center border border-[color:var(--border)]">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">New service</span>
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
