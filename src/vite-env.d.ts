/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // другие переменные окружения, если есть
}

// Расширяем существующий ImportMeta, если он уже определен vite/client
// или определяем его полностью, если нет.
// Обычно vite/client уже определяет ImportMeta, поэтому мы "дополняем" env.

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
