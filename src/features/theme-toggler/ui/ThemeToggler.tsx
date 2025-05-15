import { useStores } from "@/app/providers/StoreProvider";
import { ActionIcon, Tooltip } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Moon, Sun } from "lucide-react";
import React from "react";

export const ThemeToggler: React.FC = observer(() => {
  const { themeStore } = useStores();

  const handleToggle = () => {
    themeStore.toggleTheme();
  };

  return (
    <Tooltip
      label={
        themeStore.currentTheme === "dark" ? "Светлая тема" : "Темная тема"
      }
      position="bottom"
      withArrow
    >
      <ActionIcon
        variant="outline"
        color={themeStore.currentTheme === "dark" ? "yellow" : "blue"}
        onClick={handleToggle}
        title={
          themeStore.currentTheme === "dark"
            ? "Переключить на светлую тему"
            : "Переключить на темную тему"
        }
      >
        {themeStore.currentTheme === "dark" ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </ActionIcon>
    </Tooltip>
  );
});
