import { MantineColorScheme } from "@mantine/core";
import { makeAutoObservable, runInAction } from "mobx";

const LOCAL_STORAGE_THEME_KEY = "app-theme";

export class ThemeStore {
  currentTheme: MantineColorScheme = "light";

  constructor() {
    makeAutoObservable(this);
    this.loadThemeFromLocalStorage();
  }

  private loadThemeFromLocalStorage = () => {
    try {
      const storedTheme = localStorage.getItem(
        LOCAL_STORAGE_THEME_KEY
      ) as MantineColorScheme | null;
      if (storedTheme) {
        runInAction(() => {
          this.currentTheme = storedTheme;
        });
      } else {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        runInAction(() => {
          this.currentTheme = prefersDark ? "dark" : "light";
        });
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, this.currentTheme);
      }
    } catch (error) {
      console.error("Failed to load theme from localStorage", error);
    }
    if (typeof window !== "undefined") {
      this.applyThemeToDocument(this.currentTheme);
    }
  };

  setTheme = (theme: MantineColorScheme) => {
    this.currentTheme = theme;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
      } catch (error) {
        console.error("Failed to save theme to localStorage", error);
      }
      this.applyThemeToDocument(theme);
    }
  };

  toggleTheme = () => {
    this.setTheme(this.currentTheme === "light" ? "dark" : "light");
  };

  private applyThemeToDocument = (theme: MantineColorScheme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-mantine-color-scheme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-mantine-color-scheme", "light");
    }
  };
}
