import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-11 h-11 rounded-full border border-border hover:border-gold transition-smooth bg-background flex items-center justify-center"
    >
      <Sun
        size={18}
        className={`absolute transition-all ${
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        } text-gold`}
      />
      <Moon
        size={18}
        className={`absolute transition-all ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        } text-gold`}
      />
    </button>
  );
};

export default ThemeToggle;
