import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Tag, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchData, type Category, type Dish } from "@/utils/helpers";
import categoriesData from "@/data/categories.json";
import dishesData from "@/data/dishes.json";

const categories = categoriesData as Category[];
const dishes = dishesData as Dish[];

const SearchBar = ({ variant = "hero" }: { variant?: "hero" | "header" }) => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(id);
  }, [term]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(
    () => searchData(debounced, categories, dishes, lang),
    [debounced, lang]
  );

  const handleSelect = (catId: string) => {
    setOpen(false);
    setTerm("");
    navigate(`/category/${catId}`);
  };

  const isHero = variant === "hero";

  return (
    <div ref={ref} className={`relative w-full ${isHero ? "max-w-2xl mx-auto" : "max-w-md"}`}>
      <div className={`flex items-center bg-background border ${isHero ? "border-border shadow-elegant" : "border-border"} rounded-full overflow-hidden transition-smooth focus-within:border-gold`}>
        <Search size={isHero ? 20 : 18} className="ml-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className={`flex-1 bg-transparent border-0 outline-none px-4 ${isHero ? "py-4 text-base" : "py-2.5 text-sm"} placeholder:text-muted-foreground`}
        />
        {term && (
          <button
            onClick={() => {
              setTerm("");
              setOpen(false);
            }}
            aria-label="Clear"
            className="mr-3 p-2 rounded-full hover:bg-secondary transition-smooth"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && debounced && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-2xl shadow-elegant overflow-hidden z-50 animate-scale-in max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-6 text-center text-muted-foreground text-sm">
              {t("search.noResults")}
            </div>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    onClick={() => handleSelect(r.type === "category" ? r.id : r.categoryId!)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-secondary transition-smooth text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                      {r.type === "category" ? <Tag size={16} /> : <UtensilsCrossed size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{r.label}</div>
                      {r.categoryLabel && (
                        <div className="text-xs text-muted-foreground truncate">{r.categoryLabel}</div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
