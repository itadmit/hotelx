import type { LucideIcon } from "lucide-react";
import {
  Car,
  Coffee,
  ConciergeBell,
  IceCream,
  Info,
  Salad,
  Sparkles,
  Utensils,
  UtensilsCrossed,
  Wine,
  Wrench,
  Sandwich,
} from "lucide-react";

/** String keys stored on `Category.icon` — keep in sync with demo seed. */
export const guestCategoryIconMap: Record<string, LucideIcon> = {
  Utensils,
  Sparkles,
  ConciergeBell,
  Car,
  Wrench,
  Info,
  Coffee,
  UtensilsCrossed,
  Wine,
  IceCream,
  Sandwich,
  Salad,
};

export function guestCategoryIcon(key: string | null | undefined): LucideIcon {
  if (key && guestCategoryIconMap[key]) return guestCategoryIconMap[key];
  return Info;
}
