import { Instagram, Facebook, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import restaurant from "@/data/restaurant.json";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-ink text-white py-12 sm:py-16 mt-12">
      <div className="container text-center space-y-6">
        <h3 className="font-display text-gold text-2xl sm:text-3xl font-bold tracking-tight">
          {restaurant.name}
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-gold" />
            {restaurant.address}
          </span>
          <span className="flex items-center gap-2">
            <Phone size={16} className="text-gold" />
            {restaurant.phone}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="#"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-smooth"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-smooth"
          >
            <Facebook size={18} />
          </a>
        </div>
        <p className="text-xs text-white/50 pt-4">
          © 2025 {restaurant.name} Barcelona. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
