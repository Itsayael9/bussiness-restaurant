import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

const LANGS: { code: Lang; flag: string; label: string; alt: string }[] = [
  { code: "es", flag: "/images/flags/es.svg", label: "ES", alt: "Spain flag" },
  { code: "ca", flag: "/images/flags/ca.svg", label: "CAT", alt: "Catalonia flag" },
  { code: "en", flag: "/images/flags/us.svg", label: "EN", alt: "English flag" },
];

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang)!;
  const dropdownClassName = compact
    ? "absolute left-0 top-full mt-2 ml-1 w-44 bg-popover border border-border rounded-xl shadow-elegant overflow-visible animate-scale-in z-50"
    : "absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-44 bg-popover border border-border rounded-xl shadow-elegant overflow-visible animate-scale-in z-50";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-gold transition-smooth bg-background min-h-[44px]"
      >
        <img
          src={current.flag}
          alt={current.alt}
          className="h-4 w-7 rounded-sm object-cover shadow-sm shrink-0"
        />
        <span className="text-sm font-medium tracking-wide">{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={dropdownClassName}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 pl-5 pr-4 py-3 text-sm transition-smooth hover:bg-secondary first:rounded-t-xl last:rounded-b-xl ${
                l.code === lang ? "text-gold font-semibold" : "text-foreground"
              }`}
            >
              <img
                src={l.flag}
                alt={l.alt}
                className="h-4 w-7 rounded-sm object-cover shadow-sm shrink-0"
              />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
