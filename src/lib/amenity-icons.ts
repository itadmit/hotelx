import {
  Sparkles,
  Waves,
  Dumbbell,
  Flower2,
  UtensilsCrossed,
  Wine,
  Coffee,
  Car,
  ArrowUpDown,
  Baby,
  Wifi,
  ConciergeBell,
  Building2,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  pool: Waves,
  gym: Dumbbell,
  spa: Flower2,
  restaurant: UtensilsCrossed,
  bar: Wine,
  breakfast: Coffee,
  parking: Car,
  elevator: ArrowUpDown,
  kids: Baby,
  wifi: Wifi,
  concierge: ConciergeBell,
  lobby: Building2,
};

export function amenityIcon(key: string | null | undefined): LucideIcon {
  if (!key) return Sparkles;
  return map[key] ?? Sparkles;
}
