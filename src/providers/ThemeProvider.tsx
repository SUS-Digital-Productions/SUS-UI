import { ThemeProviderContext } from "@/hooks/use-theme";
import { APP_THEME_STORAGE_KEY, ZINC_DARK_THEME } from "@/utils/constants";
import { useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = ZINC_DARK_THEME,
  storageKey = APP_THEME_STORAGE_KEY,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const allThemes = [
      "zinc-light",
      "zinc-dark",
      "green-light",
      "green-dark",
      "blue-light",
      "blue-dark",
      "rose-dark",
      "rose-light",
      "red-light",
      "red-dark",
      "violet-dark",
      "violet-light",
      "yellow-dark",
      "yellow-light",
      "orange-dark",
      "orange-light",
    ];

    root.classList.remove(...allThemes);
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
