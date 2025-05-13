import { useStores } from "@/app/providers/StoreProvider";
import type { SessionStore as SessionStoreType } from "./model/SessionStore";

// Экспорт типов
export { SessionStore } from "./model/SessionStore";
export type {
  LoginRequestData,
  LoginResponse,
  RegisterRequestData,
  RegisterResponse,
  User,
} from "./model/types";
export type { SessionStoreType }; // Экспортируем тип SessionStore

// Экспорт хуков TanStack Query
export * from "./hooks/useSessionQueries";

// Экспорт API функций (если они все еще нужны напрямую где-то, но обычно используются через хуки)
// export * from './api/authApi'; // Оставим закомментированным, т.к. предпочтительны хуки

// Хук для доступа к SessionStore
export const useSessionStore = (): SessionStoreType => {
  return useStores().sessionStore;
};
