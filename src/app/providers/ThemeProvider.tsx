import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme | "system";
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      return storedTheme as Theme;
    }
    if (defaultTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return defaultTheme as Theme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme) {
      root.classList.add(theme);
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
