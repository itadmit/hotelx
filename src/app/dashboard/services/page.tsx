"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { ServiceImageField } from "@/components/dashboard/ServiceImageField";
import { ServiceEditModal } from "@/components/dashboard/ServiceEditModal";
import { resolveCategoryIcon } from "@/lib/category-icons";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const HOTEL_INFO_ID = "__hotel_info__";

type CatRow = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  icon: string | null;
  order: number;
};

type CategoryRowProps = {
  cat: CatRow;
  selected: boolean;
  selectedCount: number;
  menuPill?: boolean;
  indent?: boolean;
  onSelect: (id: string) => void;
  onEditIcon: (id: string) => void;
  onDelete: (cat: CatRow) => void;
};

function SortableCategoryRow(props: CategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.cat.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { cat, selected, selectedCount, menuPill, indent, onSelect, onEditIcon, onDelete } = props;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-stretch gap-0.5 rounded-md transition-colors ${
        indent ? "ml-4" : ""
      } ${selected ? "bg-background/50" : ""} ${
        isDragging ? "opacity-40 relative z-10" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${cat.name}`}
        {...attributes}
        {...listeners}
        className="shrink-0 w-6 flex items-center justify-center text-foreground/30 hover:text-foreground/70 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => onSelect(cat.id)}
        className={`flex-1 min-w-0 text-left px-2 py-2.5 rounded-md text-sm transition-colors ${
          selected
            ? "text-ink font-medium"
            : "text-foreground/60 hover:bg-background/80 hover:text-ink"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate inline-flex items-center gap-1.5">
            {cat.name}
            {menuPill ? (
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-brand bg-emerald-soft/70 px-1.5 py-0.5 rounded">
                Menu
              </span>
            ) : null}
          </span>
          {selected && (
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
              {selectedCount}
            </span>
          )}
        </div>
      </button>
      <button
        type="button"
        aria-label={`Change icon for ${cat.name}`}
        title="Change icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditIcon(cat.id);
        }}
        className="shrink-0 w-9 flex items-center justify-center rounded-md border border-transparent hover:border-[color:var(--border)] hover:bg-surface text-foreground/50 hover:text-ink transition-colors"
      >
        {(() => {
          const Icon = resolveCategoryIcon(cat.icon);
          return <Icon className="h-3.5 w-3.5" strokeWidth={2} />;
        })()}
      </button>
      <button
        type="button"
        aria-label={`Delete ${cat.name}`}
        title="Delete"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(cat);
        }}
        className="shrink-0 w-8 flex items-center justify-center rounded-md border border-transparent text-foreground/30 opacity-0 group-hover:opacity-100 hover:border-clay/30 hover:bg-clay/5 hover:text-clay transition-all"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function NonDraggableCategoryRow(props: Omit<CategoryRowProps, "menuPill" | "indent"> & { menuPill?: boolean }) {
  const { cat, selected, selectedCount, menuPill, onSelect, onEditIcon, onDelete } = props;
  return (
    <div
      className={`group flex items-stretch gap-0.5 rounded-md transition-colors ${
        selected ? "bg-background/50" : ""
      }`}
    >
      <div className="shrink-0 w-6" />
      <button
        type="button"
        onClick={() => onSelect(cat.id)}
        className={`flex-1 min-w-0 text-left px-2 py-2.5 rounded-md text-sm transition-colors ${
          selected
            ? "text-ink font-medium"
            : "text-foreground/60 hover:bg-background/80 hover:text-ink"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate inline-flex items-center gap-1.5">
            {cat.name}
            {menuPill ? (
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-brand bg-emerald-soft/70 px-1.5 py-0.5 rounded">
                Menu
              </span>
            ) : null}
          </span>
          {selected && (
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
              {selectedCount}
            </span>
          )}
        </div>
      </button>
      <button
        type="button"
        aria-label={`Change icon for ${cat.name}`}
        title="Change icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditIcon(cat.id);
        }}
        className="shrink-0 w-9 flex items-center justify-center rounded-md border border-transparent hover:border-[color:var(--border)] hover:bg-surface text-foreground/50 hover:text-ink transition-colors"
      >
        {(() => {
          const Icon = resolveCategoryIcon(cat.icon);
          return <Icon className="h-3.5 w-3.5" strokeWidth={2} />;
        })()}
      </button>
      <button
        type="button"
        aria-label={`Delete ${cat.name}`}
        title="Delete"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(cat);
        }}
        className="shrink-0 w-8 flex items-center justify-center rounded-md border border-transparent text-foreground/30 opacity-0 group-hover:opacity-100 hover:border-clay/30 hover:bg-clay/5 hover:text-clay transition-all"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function SortableHotelInfoRow() {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: HOTEL_INFO_ID });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch gap-0.5 rounded-md transition-colors border border-emerald-brand/20 bg-emerald-soft/30 ${
        isDragging ? "opacity-40 relative z-10" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Drag to reorder Hotel info"
        {...attributes}
        {...listeners}
        className="shrink-0 w-6 flex items-center justify-center text-emerald-brand/50 hover:text-emerald-brand cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <div className="flex-1 min-w-0 px-2 py-2.5 text-sm text-emerald-brand/90">
        <div className="flex items-center gap-1.5">
          <span className="truncate">Hotel info</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-brand/80 bg-emerald-brand/10 px-1.5 py-0.5 rounded">
            System
          </span>
        </div>
      </div>
      <div className="shrink-0 w-9" />
      <div className="shrink-0 w-8" />
    </div>
  );
}
import {
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Clock,
  DollarSign,
  Star,
  Info,
  Palette,
  Pencil,
  GripVertical,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

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
      requirePayment: boolean;
      image: string | null;
      category: { id: string; name: string };
    }>
  >([]);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [hotelInfoPosition, setHotelInfoPosition] = useState(0);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      parentId: string | null;
      icon: string | null;
      order: number;
    }>
  >([]);
  const [scope, setScope] = useState<"services" | "menu">("services");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [search, setSearch] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    categoryId: "",
    price: "",
    estimatedTime: "",
    description: "",
    image: null as string | null,
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
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  async function loadData(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) {
      setIsInitialLoading(true);
    }
    try {
      const [servicesRes, categoriesRes, hotelRes] = await Promise.all([
        fetch("/api/services", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/hotel", { cache: "no-store" }),
      ]);
      const servicesData = await servicesRes.json();
      const categoriesData = await categoriesRes.json();
      const hotelData = await hotelRes.json().catch(() => ({}));
      setServices(servicesData.services ?? []);
      setCategories(categoriesData.categories ?? []);
      setPaymentsEnabled(Boolean(hotelData?.hotel?.paymentsEnabled));
      setHotelInfoPosition(Number(hotelData?.hotel?.hotelInfoPosition ?? 0));
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData({ initial: true });
  }, []);

  useEffect(() => {
    setSelectedCategory("all");
  }, [scope]);

  async function createService() {
    if (!newService.name || !newService.categoryId) return;
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newService,
        price: newService.price ? Number(newService.price) : null,
        image: newService.image,
      }),
    });
    setNewService({
      name: "",
      categoryId: "",
      price: "",
      estimatedTime: "",
      description: "",
      image: null,
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

  async function deleteCategory(cat: (typeof categories)[number]) {
    const ok = window.confirm(
      `Delete category “${cat.name}”? This can't be undone.`
    );
    if (!ok) return;
    const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(
        typeof data.error === "string"
          ? data.error
          : "Could not delete category"
      );
      return;
    }
    if (selectedCategory === cat.id) setSelectedCategory("all");
    await loadData();
  }

  const childrenByParent = useMemo(() => {
    const map = new Map<string, typeof categories>();
    categories
      .filter((c) => c.parentId)
      .forEach((c) => {
        const arr = map.get(c.parentId!) ?? [];
        arr.push(c);
        map.set(c.parentId!, arr);
      });
    map.forEach((arr) => arr.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)));
    return map;
  }, [categories]);

  const allRoots = useMemo(
    () =>
      categories
        .filter((c) => !c.parentId)
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [categories]
  );
  const menuRoots = useMemo(
    () => allRoots.filter((c) => childrenByParent.has(c.id)),
    [allRoots, childrenByParent]
  );
  const serviceRoots = useMemo(
    () => allRoots.filter((c) => !childrenByParent.has(c.id)),
    [allRoots, childrenByParent]
  );
  const homeTileItems = useMemo<
    Array<{ kind: "cat"; cat: (typeof categories)[number] } | { kind: "hotel-info" }>
  >(() => {
    const items: Array<
      { kind: "cat"; cat: (typeof categories)[number] } | { kind: "hotel-info" }
    > = allRoots.map((cat) => ({ kind: "cat" as const, cat }));
    const pos = Math.max(0, Math.min(hotelInfoPosition, items.length));
    items.splice(pos, 0, { kind: "hotel-info" });
    return items;
  }, [allRoots, hotelInfoPosition]);

  const descendantIdsOf = useMemo(() => {
    return (rootId: string): Set<string> => {
      const set = new Set<string>([rootId]);
      const stack = [rootId];
      while (stack.length) {
        const id = stack.pop()!;
        const kids = childrenByParent.get(id) ?? [];
        kids.forEach((k) => {
          if (!set.has(k.id)) {
            set.add(k.id);
            stack.push(k.id);
          }
        });
      }
      return set;
    };
  }, [childrenByParent]);

  const filteredServices = useMemo(() => {
    const text = search.trim().toLowerCase();
    return services.filter((service) => {
      let categoryMatch = true;
      if (selectedCategory !== "all") {
        const ids = descendantIdsOf(selectedCategory);
        categoryMatch = ids.has(service.categoryId);
      } else if (scope === "menu") {
        const allowed = new Set<string>();
        menuRoots.forEach((r) => descendantIdsOf(r.id).forEach((id) => allowed.add(id)));
        categoryMatch = allowed.has(service.categoryId);
      } else {
        const allowed = new Set<string>();
        serviceRoots.forEach((r) => descendantIdsOf(r.id).forEach((id) => allowed.add(id)));
        categoryMatch = allowed.has(service.categoryId);
      }
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
  }, [
    services,
    search,
    selectedCategory,
    activityFilter,
    scope,
    menuRoots,
    serviceRoots,
    descendantIdsOf,
  ]);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    await reorderByIds(String(active.id), String(over.id));
  }

  function groupKeyOf(id: string): string {
    if (id === HOTEL_INFO_ID) return "home-tiles";
    const cat = categories.find((c) => c.id === id);
    if (!cat) return "unknown";
    if (cat.parentId) return `child:${cat.parentId}`;
    return "home-tiles";
  }

  function siblingIdsOf(id: string): string[] {
    const key = groupKeyOf(id);
    if (key === "home-tiles") {
      return homeTileItems.map((it) =>
        it.kind === "hotel-info" ? HOTEL_INFO_ID : it.cat.id
      );
    }
    if (key.startsWith("child:")) {
      const parentId = key.slice("child:".length);
      return (childrenByParent.get(parentId) ?? []).map((c) => c.id);
    }
    return [];
  }

  function beginSave() {
    if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
    setSaveStatus("saving");
  }

  function finishSave(ok: boolean) {
    if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
    setSaveStatus(ok ? "saved" : "error");
    saveStatusTimerRef.current = setTimeout(
      () => setSaveStatus("idle"),
      ok ? 1800 : 4000
    );
  }

  async function reorderByIds(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const key = groupKeyOf(sourceId);
    if (key === "unknown" || key !== groupKeyOf(targetId)) return;

    const siblingIds = siblingIdsOf(sourceId).slice();
    const fromIdx = siblingIds.indexOf(sourceId);
    const toIdx = siblingIds.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = siblingIds.splice(fromIdx, 1);
    siblingIds.splice(toIdx, 0, moved);

    beginSave();
    try {
      let responses: Response[];
      if (key === "home-tiles") {
        const newPos = siblingIds.indexOf(HOTEL_INFO_ID);
        const catOrder = new Map<string, number>();
        siblingIds
          .filter((id) => id !== HOTEL_INFO_ID)
          .forEach((id, i) => catOrder.set(id, i));
        setHotelInfoPosition(newPos);
        setCategories((prev) =>
          prev.map((c) => (catOrder.has(c.id) ? { ...c, order: catOrder.get(c.id)! } : c))
        );
        responses = await Promise.all([
          fetch("/api/hotel", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hotelInfoPosition: newPos }),
          }),
          ...Array.from(catOrder.entries()).map(([id, order]) =>
            fetch(`/api/categories/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order }),
            })
          ),
        ]);
      } else {
        const orderById = new Map(siblingIds.map((id, i) => [id, i]));
        setCategories((prev) =>
          prev.map((c) => (orderById.has(c.id) ? { ...c, order: orderById.get(c.id)! } : c))
        );
        responses = await Promise.all(
          siblingIds.map((id, i) =>
            fetch(`/api/categories/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: i }),
            })
          )
        );
      }
      finishSave(responses.every((r) => r.ok));
    } catch {
      finishSave(false);
    }
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
            onClick={() => {
              setNewService({
                name: "",
                categoryId: "",
                price: "",
                estimatedTime: "",
                description: "",
                image: null,
              });
              setIsAddServiceOpen(true);
            }}
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
            <ServiceImageField
              value={newService.image}
              onChange={(image) => setNewService((prev) => ({ ...prev, image }))}
            />
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
              Top-level categories (no parent) appear as tiles on the guest home.
              Food menus should live as subcategories under Room Service so they stay
              inside that hub. Icons on the home grid use the parent category only.
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

      <ServiceEditModal
        open={editingServiceId != null}
        onOpenChange={(open) => {
          if (!open) setEditingServiceId(null);
        }}
        serviceId={editingServiceId}
        categories={categories}
        paymentsEnabled={paymentsEnabled}
        initialService={
          editingServiceId
            ? services.find((s) => s.id === editingServiceId) ?? null
            : null
        }
        onSaved={() => loadData()}
      />

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
          <div
            role="tablist"
            aria-label="Category scope"
            className="grid grid-cols-2 gap-1 p-1 bg-surface rounded-md border border-[color:var(--border)]"
          >
            {(["services", "menu"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={scope === s}
                onClick={() => setScope(s)}
                className={`text-xs font-medium px-3 py-1.5 rounded-[5px] transition-colors ${
                  scope === s
                    ? "bg-white text-ink shadow-sm"
                    : "text-foreground/60 hover:text-ink"
                }`}
              >
                {s === "services" ? "Services" : "Menu"}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between px-1 mb-2 gap-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                {scope === "menu" ? "Menu" : "Categories"}
              </h3>
              <div className="flex items-center gap-1.5">
                {saveStatus !== "idle" ? (
                  <span
                    aria-live="polite"
                    className={`flex items-center gap-1 font-mono text-[10px] tracking-wide transition-opacity ${
                      saveStatus === "error"
                        ? "text-clay"
                        : saveStatus === "saved"
                          ? "text-emerald-brand"
                          : "text-foreground/50"
                    }`}
                  >
                    {saveStatus === "saving" ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
                    ) : saveStatus === "saved" ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    <span>
                      {saveStatus === "saving"
                        ? "Saving"
                        : saveStatus === "saved"
                          ? "Saved"
                          : "Save failed"}
                    </span>
                  </span>
                ) : (
                  <InfoTooltip
                    content="Drag the handle to reorder. Order shows up on the guest home tiles."
                    side="left"
                  >
                    <span className="text-foreground/40">
                      <Info className="h-3 w-3" />
                    </span>
                  </InfoTooltip>
                )}
              </div>
            </div>
            <nav className="space-y-0.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-background/50 text-ink font-medium"
                    : "text-foreground/60 hover:bg-background/80 hover:text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {scope === "menu" ? "All menu items" : "All services"}
                  </span>
                  {selectedCategory === "all" && (
                    <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                      {filteredServices.length}
                    </span>
                  )}
                </div>
              </button>

              {(() => {
                const openIconPicker = (id: string) => {
                  setCategoryIconPickerTarget(id);
                  setCategoryIconPickerOpen(true);
                };

                if (scope === "services") {
                  const ids = homeTileItems.map((it) =>
                    it.kind === "hotel-info" ? HOTEL_INFO_ID : it.cat.id
                  );
                  return (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                        {homeTileItems.map((item) =>
                          item.kind === "hotel-info" ? (
                            <SortableHotelInfoRow key={HOTEL_INFO_ID} />
                          ) : (
                            <SortableCategoryRow
                              key={item.cat.id}
                              cat={item.cat}
                              selected={selectedCategory === item.cat.id}
                              selectedCount={filteredServices.length}
                              menuPill={childrenByParent.has(item.cat.id)}
                              onSelect={setSelectedCategory}
                              onEditIcon={openIconPicker}
                              onDelete={deleteCategory}
                            />
                          )
                        )}
                      </SortableContext>
                    </DndContext>
                  );
                }

                if (menuRoots.length === 0) {
                  return (
                    <p className="text-xs text-foreground/50 px-3 py-4">
                      No menu yet. Add a parent category (e.g. Room Service) and nest
                      subcategories (Breakfast, Mains, …) under it.
                    </p>
                  );
                }

                return (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    {menuRoots.map((root) => {
                      const kids = childrenByParent.get(root.id) ?? [];
                      const kidIds = kids.map((k) => k.id);
                      return (
                        <div key={root.id} className="space-y-0.5">
                          <NonDraggableCategoryRow
                            cat={root}
                            selected={selectedCategory === root.id}
                            selectedCount={filteredServices.length}
                            menuPill
                            onSelect={setSelectedCategory}
                            onEditIcon={openIconPicker}
                            onDelete={deleteCategory}
                          />
                          <SortableContext items={kidIds} strategy={verticalListSortingStrategy}>
                            {kids.map((child) => (
                              <SortableCategoryRow
                                key={child.id}
                                cat={child}
                                indent
                                selected={selectedCategory === child.id}
                                selectedCount={filteredServices.length}
                                onSelect={setSelectedCategory}
                                onEditIcon={openIconPicker}
                                onDelete={deleteCategory}
                              />
                            ))}
                          </SortableContext>
                        </div>
                      );
                    })}
                  </DndContext>
                );
              })()}
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
                  <InfoTooltip content="Edit name, photo, category, pricing, and status">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingServiceId(service.id);
                      }}
                      aria-label={`Edit ${service.name}`}
                      className="h-8 w-8 rounded-md flex items-center justify-center text-foreground/45 hover:text-ink hover:bg-surface border border-transparent hover:border-[color:var(--border)] transition-colors"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </InfoTooltip>
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
