import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import categoriesData from "@/data/categories.json";
import { type Category } from "@/utils/helpers";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(id);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const categories = (categoriesData as Category[])
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="categories" className="container py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <p className="text-gold text-xs sm:text-sm tracking-[0.4em] uppercase mb-3 font-medium">
          {t("categories.subtitle")}
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          {t("categories.title")}
        </h2>
        <div className="h-px w-24 bg-gold mx-auto mt-6" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-secondary animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((c, i) => (
            <CategoryCard
              key={c.id}
              category={c}
              index={i}
              isFavorite={favorites.includes(c.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;
