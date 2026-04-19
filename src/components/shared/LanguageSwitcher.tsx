import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "ca", flag: "🏴", label: "CAT" },
  { code: "en", flag: "🇬🇧", label: "EN" },
];

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang)!;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-gold transition-smooth bg-background min-h-[44px]"
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <span className="text-sm font-medium tracking-wide">{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-xl shadow-elegant overflow-hidden animate-scale-in z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-smooth hover:bg-secondary ${
                l.code === lang ? "text-gold font-semibold" : "text-foreground"
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
