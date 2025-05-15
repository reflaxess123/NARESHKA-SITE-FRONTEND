import React from "react";
import ReactDOM from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import { StoreProvider } from "./providers/StoreProvider";
import "./styles/index.css"; // Путь к стилям из src/app/styles/
import App from "./App";

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
