import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import SearchBar from "./SearchBar";
import restaurant from "@/data/restaurant.json";

const Header = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-smooth ${
          scrolled
            ? "bg-background/85 backdrop-blur-lg shadow-soft"
            : "bg-background"
        }`}
      >
        <div
          className={`bg-gold text-black dark:bg-white dark:text-black border-b border-black/20 dark:border-white/20 transition-all duration-300 overflow-hidden ${
            scrolled ? "max-h-0 opacity-0 border-b-0" : "max-h-8 opacity-100"
          }`}
        >
          <div className="container h-8 flex items-center justify-center">
            <p className="text-[11px] sm:text-xs font-medium tracking-wide text-center truncate">
              {t("hours.brief")}
            </p>
          </div>
        </div>
        <div className="container flex items-center justify-between h-16 sm:h-20 gap-4">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <span className="font-display text-gold text-xl sm:text-2xl font-bold tracking-tight">
              {restaurant.name}
            </span>
          </Link>

          <div className="hidden lg:block flex-1 max-w-md mx-auto">
            <SearchBar variant="header" />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setOpenMenu(true)}
              aria-label="Open menu"
              className="sm:hidden w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-gold transition-smooth"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {openMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background shadow-elegant flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display text-gold text-xl font-bold">
                  {restaurant.name}
                </span>
                <button
                  onClick={() => setOpenMenu(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <SearchBar variant="header" />
                <div className="pt-2 flex items-center gap-3">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
