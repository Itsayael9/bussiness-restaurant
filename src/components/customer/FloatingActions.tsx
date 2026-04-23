import { MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import restaurant from "@/data/restaurant.json";

type RestaurantData = typeof restaurant & { googleMapsUrl?: string };
const data = restaurant as RestaurantData;

const FloatingActions = () => {
  const { t } = useTranslation();

  const wa = `https://wa.me/${data.whatsapp.replace(
    /\D/g,
    ""
  )}?text=Hola%2C%20quisiera%20hacer%20una%20reserva`;
  const map =
    data.googleMapsUrl ??
    `https://www.google.com/maps?q=${data.coordinates.lat},${data.coordinates.lng}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-3">
      <motion.a
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("actions.whatsapp")}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-elegant"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={22} fill="currentColor" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-ink text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none">
          {t("actions.whatsapp")}
        </span>
      </motion.a>

      <motion.a
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href={map}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("actions.location")}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold text-white flex items-center justify-center shadow-gold"
      >
        <MapPin size={22} />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-ink text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none">
          {t("actions.location")}
        </span>
      </motion.a>
    </div>
  );
};

export default FloatingActions;
