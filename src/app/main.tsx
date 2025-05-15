import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { QueryProvider } from "./providers/QueryProvider";
import { StoreProvider } from "./providers/StoreProvider";

// Используем CSS переменные для цветов
const theme = createTheme({
  fontFamily: "Inter, sans-serif", // Пример шрифта, можно заменить или убрать
  primaryColor: "appPrimary", // Назначаем наш кастомный цвет как основной
  colors: {
    // Определяем наш 'appPrimary' цвет.
    // Мы используем CSS-переменную, которая будет меняться для светлой/темной темы.
    // Mantine требует массив из 10 оттенков. Мы заполним его одним и тем же значением
    // для простоты, или можно будет расширить позже.
    // Ключевой оттенок обычно 5 или 6.
    appPrimary: [
      "var(--primary)",
      "var(--primary)",
      "var(--primary)",
      "var(--primary)",
      "var(--primary)",
      "var(--primary)", // Основной оттенок
      "var(--primary)",
      "var(--primary)",
      "var(--primary)",
      "var(--primary)",
    ],
    // Добавляем appSecondary, используя CSS-переменную var(--secondary)
    appSecondary: [
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)", // Основной оттенок
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)",
      "var(--secondary)",
    ],
  },
  // Добавляем глобальные CSS переменные в 'other' для удобного доступа в sx пропах
  other: {
    radius: "var(--radius)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    // ... и так далее для других переменных
  },
  // Для глобального применения фона и цвета текста из CSS переменных
  // можно использовать MantineProvider props или GlobalStyles,
  // но так как index.css уже применяется глобально,
  // основные body styles должны работать.
  // Однако, можно здесь явно указать стили для body, если нужно:
});

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryProvider>
        <StoreProvider>
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <Notifications />
            <App />
          </MantineProvider>
        </StoreProvider>
      </QueryProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
