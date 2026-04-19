import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import FloatingActions from "@/components/customer/FloatingActions";
import DishList from "@/components/customer/DishList";
import DishModal from "@/components/customer/DishModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterDishes, type Category, type Dish } from "@/utils/helpers";
import categoriesData from "@/data/categories.json";
import dishesData from "@/data/dishes.json";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [selected, setSelected] = useState<Dish | null>(null);

  const category = useMemo(
    () => (categoriesData as Category[]).find((c) => c.id === categoryId),
    [categoryId]
  );

  const dishes = useMemo(
    () => (categoryId ? filterDishes(dishesData as Dish[], categoryId) : []),
    [categoryId]
  );

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">404</p>
          <button onClick={() => navigate("/")} className="btn-gold">
            {t("category.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Header />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] sm:h-[55vh] overflow-hidden bg-ink">
        <img
          src={category.image}
          alt={category.name[lang]}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero-text)" }} />
        <div className="relative h-full container flex flex-col justify-end pb-10 sm:pb-14">
          <nav
            aria-label="Breadcrumb"
            className="absolute top-6 left-6 sm:left-8 flex items-center gap-1.5 text-xs sm:text-sm text-white/85"
          >
            <Link to="/" className="hover:text-gold transition-smooth">
              {t("category.breadcrumbHome")}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gold">{category.name[lang]}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-white text-5xl sm:text-7xl font-bold hero-text-shadow"
          >
            {category.name[lang]}
          </motion.h1>
          <div className="h-0.5 w-20 bg-gold mt-4" />
        </div>
      </section>

      <main className="container py-10 sm:py-14 max-w-3xl">
        <button
          onClick={() => navigate("/")}
          className="text-gold hover:text-gold-dark text-sm font-medium transition-smooth mb-8"
        >
          {t("category.back")}
        </button>

        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          {t("category.dishes")}
        </h2>
        <div className="h-px w-16 bg-gold mb-8" />

        <DishList dishes={dishes} onSelect={setSelected} />
      </main>

      <Footer />
      <FloatingActions />
      <DishModal dish={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
};

export default CategoryDetail;
