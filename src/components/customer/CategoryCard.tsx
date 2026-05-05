import { Heart, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Category } from "@/utils/helpers";

interface Props {
  category: Category;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const CategoryCard = ({ category, index, isFavorite, onToggleFavorite }: Props) => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [src, setSrc] = useState(category.image);

  useEffect(() => {
    setImgError(false);
    setSrc(category.image);
  }, [category.image]);

  const fallbackById: Record<string, string> = {
    "cat-3": "/images/cat-3.png",
    "cat-12": "/images/cat-12.png",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.04 }}
      className="group relative cursor-pointer"
      onClick={() => navigate(`/category/${category.id}`)}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-gold transition-smooth shadow-soft">
        {imgError ? (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <UtensilsCrossed className="text-muted-foreground" size={40} />
          </div>
        ) : (
          <img
            src={src}
            alt={category.name[lang]}
            loading="lazy"
            onError={() => {
              const fallback = fallbackById[category.id];
              if (fallback && src !== fallback) {
                setSrc(fallback);
                return;
              }
              setImgError(true);
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-overlay)" }}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(category.id);
          }}
          aria-label="Favorite"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/30 backdrop-blur-md border border-white/30 flex items-center justify-center transition-smooth hover:bg-background/50"
        >
          <Heart
            size={16}
            className={isFavorite ? "text-gold" : "text-white"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
          <h3 className="font-display text-white text-xl sm:text-2xl font-semibold group-hover:text-gold transition-smooth">
            {category.name[lang]}
          </h3>
          <div className="h-0.5 w-10 bg-gold mt-2 group-hover:w-20 transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
