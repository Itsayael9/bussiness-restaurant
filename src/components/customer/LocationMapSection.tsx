import { motion } from "framer-motion";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import restaurant from "@/data/restaurant.json";

type Localized = Record<Lang, string>;

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type OpeningDay = { day: WeekDay; from?: string; to?: string };

type RestaurantData = typeof restaurant & {
  googleMapsUrl?: string;
  openingHours?: {
    weekly: OpeningDay[];
  };
};

const data = restaurant as RestaurantData;

const LocationMapSection = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const { lat, lng } = data.coordinates;
  const hl = lang === "en" ? "en" : lang === "ca" ? "ca" : "es";
  const embedSrc = `https://www.google.com/maps?q=${lat}%2C${lng}&z=17&hl=${hl}&output=embed`;
  const openHref =
    data.googleMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.name} ${data.address}`)}`;

  return (
    <section id="location" aria-labelledby="location-heading" className="container py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-gold text-xs sm:text-sm tracking-[0.4em] uppercase mb-3 font-medium">
          {t("location.subtitle")}
        </p>
        <h2
          id="location-heading"
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground"
        >
          {t("location.title")}
        </h2>
        <div className="h-px w-24 bg-gold mx-auto mt-6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-stretch"
      >
        {data.openingHours && (
          <aside
            className="order-2 lg:order-1 rounded-2xl border border-border bg-card shadow-soft p-6 sm:p-8 flex flex-col"
            aria-labelledby="hours-heading"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Clock className="text-gold" size={22} strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <h3 id="hours-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {t("hours.title")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 tracking-wide">{t("hours.subtitle")}</p>
              </div>
            </div>

            <ul className="space-y-0 flex-1">
              {data.openingHours.weekly.map((row, i) => (
                <li
                  key={row.day}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-4 ${
                    i > 0 ? "border-t border-border/80" : ""
                  }`}
                >
                  <span className="text-sm font-semibold uppercase tracking-wider text-gold">
                    {t(`hours.days.${row.day}`)}
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-semibold text-foreground tabular-nums tracking-tight">
                    {row.from && row.to ? (
                      <>
                        {row.from}
                        <span className="text-muted-foreground font-normal mx-1.5 sm:mx-2">—</span>
                        {row.to}
                      </>
                    ) : (
                      <span className="text-muted-foreground font-normal">{t("hours.closed")}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground mt-6 pt-6 border-t border-border/60 leading-relaxed">
              {t("hours.footerNote")}
            </p>
          </aside>
        )}

        <div className="order-1 lg:order-2 flex flex-col min-h-0">
          <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-soft bg-secondary aspect-[16/10] sm:aspect-[21/9] min-h-[220px] sm:min-h-[300px] flex-1">
            <iframe
              title={t("location.mapTitle")}
              src={embedSrc}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm sm:text-base">
              <MapPin size={18} className="text-gold shrink-0" />
              <span>{data.address}</span>
            </p>
            <a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium text-sm transition-smooth shrink-0"
            >
              {t("location.openMaps")}
              <ExternalLink size={16} aria-hidden />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LocationMapSection;
