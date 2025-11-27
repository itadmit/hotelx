import { Star, Flame, Sparkles, Leaf, Sprout } from "lucide-react";

interface ServiceTagsProps {
  isRecommended?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  language?: string;
}

const translations = {
  en: {
    recommended: "Recommended",
    new: "New",
    hot: "Hot",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
  },
  he: {
    recommended: "מומלץ",
    new: "חדש",
    hot: "פופולרי",
    vegetarian: "צמחוני",
    vegan: "טבעוני",
  },
  bg: {
    recommended: "Препоръчано",
    new: "Ново",
    hot: "Горещо",
    vegetarian: "Вегетариански",
    vegan: "Веган",
  },
  de: {
    recommended: "Empfohlen",
    new: "Neu",
    hot: "Beliebt",
    vegetarian: "Vegetarisch",
    vegan: "Vegan",
  },
  fr: {
    recommended: "Recommandé",
    new: "Nouveau",
    hot: "Populaire",
    vegetarian: "Végétarien",
    vegan: "Végétalien",
  },
  it: {
    recommended: "Consigliato",
    new: "Nuovo",
    hot: "Popolare",
    vegetarian: "Vegetariano",
    vegan: "Vegano",
  },
};

export function ServiceTags({
  isRecommended,
  isNew,
  isHot,
  isVegetarian,
  isVegan,
  language = "en",
}: ServiceTagsProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const tags = [];

  if (isRecommended) {
    tags.push({
      icon: Star,
      label: t.recommended,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    });
  }

  if (isNew) {
    tags.push({
      icon: Sparkles,
      label: t.new,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    });
  }

  if (isHot) {
    tags.push({
      icon: Flame,
      label: t.hot,
      color: "bg-red-50 text-red-700 border-red-200",
    });
  }

  if (isVegetarian) {
    tags.push({
      icon: Leaf,
      label: t.vegetarian,
      color: "bg-green-50 text-green-700 border-green-200",
    });
  }

  if (isVegan) {
    tags.push({
      icon: Sprout,
      label: t.vegan,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag, index) => {
        const Icon = tag.icon;
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tag.color}`}
          >
            <Icon className="h-3 w-3" />
            <span>{tag.label}</span>
          </div>
        );
      })}
    </div>
  );
}



