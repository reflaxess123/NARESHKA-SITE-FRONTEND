import { QueryClient } from "@tanstack/react-query";
import { makeAutoObservable } from "mobx";
// Прямой импорт SessionStore из его файла модели
import { SessionStore } from "@/entities/session/model/SessionStore";
// User можно оставить из общего экспорта, если он не создает проблем, или также импортировать напрямую, если потребуется
import { ThemeStore } from "@/entities/theme";

// Пока RootStore пустой, но сюда можно будет добавлять другие сторы
// export class SessionStore { ... }

export class RootStore {
  sessionStore: SessionStore;
  themeStore: ThemeStore;
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    // Сначала создаем экземпляры сторов
    this.themeStore = new ThemeStore();
    this.sessionStore = new SessionStore(this, this.queryClient);

    // Вызываем makeAutoObservable после инициализации всех свойств
    makeAutoObservable(
      this,
      {
        // Если есть поля, которые не должны быть observable в RootStore, их можно указать здесь
        // Например, sessionStore: false, если мы хотим управлять им вручную или он не должен быть частью авто-реактивности RootStore
        // Но обычно сторы внутри RootStore тоже делают observable
        queryClient: false,
      },
      { autoBind: true }
    );
  }

  // Сюда можно добавить общие методы или свойства для RootStore
  // например, для гидратации или инициализации

  // Пример гидратации, если понадобится для SSR или других целей
  // hydrate(data: { user?: User | null }) {
  //   if (data.user) {
  //     this.sessionStore.setUser(data.user);
  //   }
  // }
}
