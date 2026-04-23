import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Bath,
  Bed,
  Bell,
  Building2,
  Calendar,
  Camera,
  Car,
  ClipboardList,
  Coffee,
  ConciergeBell,
  CreditCard,
  Dumbbell,
  Flower2,
  Gift,
  Heart,
  IceCream,
  Info,
  KeyRound,
  Luggage,
  MapPin,
  Music,
  Package,
  ParkingCircle,
  Phone,
  Plane,
  Salad,
  Sandwich,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Tv,
  Utensils,
  UtensilsCrossed,
  Users,
  Waves,
  Wifi,
  Wine,
  Wrench,
} from "lucide-react";

/** PascalCase keys — stored in `Category.icon`, editable per hotel. */
export const CATEGORY_ICON_KEYS = [
  "Utensils",
  "Coffee",
  "Wine",
  "IceCream",
  "Sandwich",
  "Salad",
  "UtensilsCrossed",
  "Sparkles",
  "ConciergeBell",
  "Bell",
  "Bed",
  "Bath",
  "Wifi",
  "Phone",
  "Car",
  "ParkingCircle",
  "Plane",
  "Luggage",
  "MapPin",
  "KeyRound",
  "Building2",
  "ShoppingBag",
  "Gift",
  "Package",
  "Truck",
  "Wrench",
  "Heart",
  "Star",
  "Users",
  "Music",
  "Camera",
  "Tv",
  "AirVent",
  "Dumbbell",
  "Waves",
  "Flower2",
  "CreditCard",
  "Calendar",
  "ClipboardList",
  "Info",
] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number];

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Coffee,
  Wine,
  IceCream,
  Sandwich,
  Salad,
  UtensilsCrossed,
  Sparkles,
  ConciergeBell,
  Bell,
  Bed,
  Bath,
  Wifi,
  Phone,
  Car,
  ParkingCircle,
  Plane,
  Luggage,
  MapPin,
  KeyRound,
  Building2,
  ShoppingBag,
  Gift,
  Package,
  Truck,
  Wrench,
  Heart,
  Star,
  Users,
  Music,
  Camera,
  Tv,
  AirVent,
  Dumbbell,
  Waves,
  Flower2,
  CreditCard,
  Calendar,
  ClipboardList,
  Info,
};

const ALLOWED = new Set(CATEGORY_ICON_KEYS);

export function isValidCategoryIconKey(key: string): key is CategoryIconKey {
  return ALLOWED.has(key as CategoryIconKey);
}

/** Resolve Lucide icon from DB `Category.icon` string (PascalCase). */
export function resolveCategoryIcon(key: string | null | undefined): LucideIcon {
  if (key && ICON_MAP[key]) return ICON_MAP[key];
  // Never default to `Info` — null icons looked like the real "Info" department
  // on the guest home grid (e.g. Spa with no icon set).
  return ConciergeBell;
}

/** @deprecated use resolveCategoryIcon */
export const guestCategoryIcon = resolveCategoryIcon;
