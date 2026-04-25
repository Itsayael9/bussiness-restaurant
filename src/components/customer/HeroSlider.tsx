import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePublicMenu } from "@/contexts/PublicMenuContext";

const HeroSlider = () => {
  const { t } = useTranslation();
  const { sliderSlides, loading } = usePublicMenu();
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () => sliderSlides.filter((s) => s.active).sort((a, b) => a.order - b.order),
    [sliderSlides]
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 2000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  const go = (delta: number) => {
    if (slides.length === 0) return;
    setIndex((i) => (i + delta + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-ink aspect-[16/9] md:aspect-[21/9] max-h-[80vh] animate-pulse" />
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-ink aspect-[16/9] md:aspect-[21/9] max-h-[80vh]">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero-text)" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 min-h-[280px]">
          <p className="text-white/90 text-xs sm:text-sm tracking-[0.4em] uppercase mb-3 sm:mb-5 font-medium hero-text-shadow">
            {t("hero.subtitle")}
          </p>
          <h1 className="font-display text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight hero-text-shadow leading-tight">
            {t("hero.title")}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-ink aspect-[16/9] md:aspect-[21/9] max-h-[80vh]">
      <AnimatePresence mode="sync">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[index].url}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero-text)" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-white/90 text-xs sm:text-sm tracking-[0.4em] uppercase mb-3 sm:mb-5 font-medium hero-text-shadow">
            {t("hero.subtitle")}
          </p>
          <h1 className="font-display text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight hero-text-shadow leading-tight">
            {t("hero.title")}
          </h1>
        </motion.div>
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:border-gold transition-smooth"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:border-gold transition-smooth"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-gold" : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
