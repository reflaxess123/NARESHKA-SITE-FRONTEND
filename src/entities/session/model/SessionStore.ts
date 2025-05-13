import type { RootStore } from "@/app/providers/StoreProvider/RootStore"; // Путь к RootStore
import { QueryClient } from "@tanstack/react-query";
import { makeAutoObservable, runInAction } from "mobx";
import { fetchProfile, sessionKeys } from "../api/authApi";
import { User } from "./types";
// import { queryClient } from '@/app/providers/QueryProvider'; // Неправильно, queryClient не экспортируется так

export class SessionStore {
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  isSessionLoading: boolean = true; // Начальное состояние - загрузка сессии

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private rootStore: RootStore;
  private queryClient: QueryClient;

  constructor(rootStore: RootStore, queryClient: QueryClient) {
    this.rootStore = rootStore;
    this.queryClient = queryClient;
    // Приватные поля rootStore и queryClient не будут сделаны observable по умолчанию
    makeAutoObservable(this, {}, { autoBind: true });
    this.checkAuthStatus();
  }

  async checkAuthStatus() {
    if (!this.isSessionLoading) {
      this.isSessionLoading = true;
    }
    try {
      // Пытаемся получить данные профиля из кэша TanStack Query или выполнить запрос
      const user = await this.queryClient.fetchQuery<User, Error>({
        queryKey: sessionKeys.profile(),
        queryFn: fetchProfile,
        staleTime: 5 * 60 * 1000, // Можно настроить или взять из дефолтных опций клиента
      });
      runInAction(() => {
        this.setSession(user);
      });
    } catch (error) {
      // Если запрос неудачный (например, 401), пользователь не аутентифицирован
      console.info(
        "Session check: User not authenticated or error occurred.",
        error
      );
      runInAction(() => {
        this.clearSession(); // Убеждаемся, что сессия очищена
        this.isSessionLoading = false; // Завершаем загрузку в любом случае
      });
    }
  }

  setSession(user: User | null) {
    this.currentUser = user;
    this.isAuthenticated = !!user;
    this.isSessionLoading = false;
  }

  clearSession() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isSessionLoading = false;
    // Принудительно удаляем кэш профиля, чтобы при следующем checkAuthStatus был новый запрос
    this.queryClient.removeQueries({ queryKey: sessionKeys.profile() });
  }
}
