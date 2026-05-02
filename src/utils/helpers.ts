import { Wheat, Milk, Nut, Shell, Egg, AlertCircle, type LucideIcon } from "lucide-react";
import type { Lang } from "@/contexts/LanguageContext";

export interface LocalizedString {
  es: string;
  ca: string;
  en: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  image: string;
  order: number;
  active: boolean;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  image?: string;
  allergens: string[];
  active: boolean;
  order: number;
}

export const formatPrice = (price: number) =>
  `€${price.toFixed(2).replace(".", ",")}`;

export const getAllergenIcon = (allergen: string): LucideIcon => {
  const map: Record<string, LucideIcon> = {
    gluten: Wheat,
    lactose: Milk,
    nuts: Nut,
    seafood: Shell,
    eggs: Egg,
  };
  return map[allergen] ?? AlertCircle;
};

export const getAllergenLabel = (allergen: string, t: (k: string) => string) =>
  t(`allergens.${allergen}`);

export const filterDishes = (dishes: Dish[], categoryId: string) =>
  dishes
    .filter((d) => d.active && d.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);

export interface SearchResult {
  type: "category" | "dish";
  id: string;
  label: string;
  categoryId?: string;
  categoryLabel?: string;
}

export const searchData = (
  term: string,
  categories: Category[],
  dishes: Dish[],
  lang: Lang
): SearchResult[] => {
  const q = term.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const c of categories) {
    if (!c.active) continue;
    const match = ["es", "ca", "en"].some((l) =>
      c.name[l as Lang].toLowerCase().includes(q)
    );
    if (match) {
      results.push({ type: "category", id: c.id, label: c.name[lang] });
    }
  }

  for (const d of dishes) {
    if (!d.active) continue;
    const match = ["es", "ca", "en"].some((l) =>
      d.name[l as Lang].toLowerCase().includes(q) ||
      d.description[l as Lang].toLowerCase().includes(q)
    );
    if (match) {
      const cat = categories.find((c) => c.id === d.categoryId);
      results.push({
        type: "dish",
        id: d.id,
        label: d.name[lang],
        categoryId: d.categoryId,
        categoryLabel: cat?.name[lang],
      });
    }
  }

  return results.slice(0, 6);
};
