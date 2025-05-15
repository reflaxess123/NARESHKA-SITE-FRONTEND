import React from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Button } from "@/shared/ui/button";
import { Moon, Sun } from "lucide-react"; // Предполагаем, что используются иконки lucide-react
import { cn } from "@/shared/lib/utils"; // Импортируем cn

interface ThemeSwitcherProps {
  displayMode?: "button" | "iconOnly";
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  displayMode = "button",
  className,
}) => {
  const { theme, toggleTheme } = useTheme();

  const icon = (
    <>
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-gray-200" /> // Используем text-gray-200 для лучшей совместимости в темных темах
      )}
      <span className="sr-only">Переключить тему</span>
    </>
  );

  if (displayMode === "iconOnly") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "p-2 bg-transparent border-none rounded-full focus:outline-none", // Убраны hover и focus:ring эффекты
          className
        )}
        aria-label="Переключить тему"
      >
        {icon}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "dark:bg-card dark:border-border dark:hover:bg-muted dark:hover:border-accent",
        className
      )}
    >
      {icon}
    </Button>
  );
};
