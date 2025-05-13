import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "."; // Путь к App из src/app/index.ts
import { QueryProvider } from "./providers/QueryProvider";
import { StoreProvider } from "./providers/StoreProvider";
import "./styles/index.css"; // Путь к стилям из src/app/styles/

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </QueryProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
