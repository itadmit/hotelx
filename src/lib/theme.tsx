"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type DashboardTheme = "maison" | "tech";

const STORAGE_KEY = "hotelx-theme";

type ThemeContextValue = {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<DashboardTheme>("maison");

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (window.localStorage.getItem(STORAGE_KEY) as DashboardTheme | null)) ||
      null;
    if (stored === "maison" || stored === "tech") {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "maison");
    }
  }, []);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "maison" ? "tech" : "maison");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}

/**
 * Pre-paint inline script — sets data-theme before React hydrates,
 * preventing the wrong theme from flashing on first load.
 */
export const themeInitScript = `
(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="maison"&&t!=="tech"){t="maison"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","maison")}})();
`;
