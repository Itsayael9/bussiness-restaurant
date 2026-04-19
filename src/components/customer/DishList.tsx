import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, getAllergenIcon, getAllergenLabel, type Dish } from "@/utils/helpers";

interface Props {
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
}

const DishList = ({ dishes, onSelect }: Props) => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  if (dishes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {t("category.empty")}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {dishes.map((d, i) => (
        <motion.li
          key={d.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <button
            onClick={() => onSelect(d)}
            className="w-full text-left py-6 sm:py-7 group transition-smooth hover:bg-secondary/40 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-lg"
          >
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground group-hover:text-gold transition-smooth">
                {d.name[lang]}
              </h3>
              <span className="font-display text-gold text-xl sm:text-2xl font-semibold whitespace-nowrap">
                {formatPrice(d.price)}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-2 leading-relaxed text-sm sm:text-base">
              {d.description[lang]}
            </p>
            {d.allergens.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {d.allergens.map((a) => {
                  const Icon = getAllergenIcon(a);
                  return (
                    <span
                      key={a}
                      title={getAllergenLabel(a, t)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[11px]"
                    >
                      <Icon size={11} className="text-gold" />
                      {getAllergenLabel(a, t)}
                    </span>
                  );
                })}
              </div>
            )}
          </button>
        </motion.li>
      ))}
    </ul>
  );
};

export default DishList;
