import { QueryClient } from "@tanstack/react-query";
import { makeAutoObservable } from "mobx";
import { SessionStore } from "../../../entities/session/model/SessionStore"; // Изменен на прямой путь к модели

// Пока RootStore пустой, но сюда можно будет добавлять другие сторы
// export class SessionStore { ... }

export class RootStore {
  sessionStore: SessionStore;
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.sessionStore = new SessionStore(this, this.queryClient);
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
}
