import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, getAllergenIcon, getAllergenLabel, type Dish } from "@/utils/helpers";

interface Props {
  dish: Dish | null;
  onClose: () => void;
}

const DishModal = ({ dish, onClose }: Props) => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!dish) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dish, onClose]);

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-3xl shadow-elegant max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 sm:p-12"
          >
            <button
              onClick={onClose}
              aria-label={t("actions.close")}
              className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-smooth"
            >
              <X size={20} />
            </button>

            <div className="text-center pt-2">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {dish.name[lang]}
              </h2>
              <div className="h-px w-16 bg-gold mx-auto my-5" />
              <p className="font-display text-gold text-3xl sm:text-4xl font-semibold">
                {formatPrice(dish.price)}
              </p>
              <p className="text-muted-foreground mt-6 max-w-md mx-auto leading-relaxed">
                {dish.description[lang]}
              </p>

              {dish.allergens.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    {t("dish.allergens")}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {dish.allergens.map((a) => {
                      const Icon = getAllergenIcon(a);
                      return (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground text-xs"
                        >
                          <Icon size={14} className="text-gold" />
                          {getAllergenLabel(a, t)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DishModal;
