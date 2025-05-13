import type { LoginRequestData } from "@/entities/session";
import { makeAutoObservable } from "mobx";
// Нельзя использовать хуки useLoginMutation внутри класса Store.
// Вместо этого, мы можем либо:
// 1. Передать саму функцию мутации (apiLogin) и queryClient для инвалидации.
// 2. Фича сама будет вызывать хук useLoginMutation, а стор будет использоваться только для данных формы и состояния UI.
// Выберем вариант, где стор вызывает apiLogin, а фича (компонент) обернет это в useLoginMutation, если ей нужны доп. возможности хука.
// Либо, компонент передает pre-configured `mutate` функцию из useLoginMutation в стор.
// Для простоты стора, он будет просто вызывать API, а компонент пусть использует хук.
// Тогда стор не будет заниматься вызовом мутации.

// Стор для UI-состояния формы логина.
// Логика вызова мутации и реакции на нее (обновление SessionStore)
// находится в компоненте, использующем useLoginMutation.

export class LoginFormStore {
  email = "";
  password = "";
  error: string | null = null;
  // isLoading будет управляться компонентом через useLoginMutation.isPending

  // private sessionStore: SessionStore; // Если нужно для каких-то действий после успешного логина, не связанных с мутацией

  constructor(/* private sessionStore: SessionStore */) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setEmail(email: string) {
    this.email = email;
    if (this.error) this.setError(null); // Сбрасываем ошибку при изменении поля
  }

  setPassword(password: string) {
    this.password = password;
    if (this.error) this.setError(null);
  }

  setError(error: string | null) {
    this.error = error;
  }

  resetForm() {
    this.email = "";
    this.password = "";
    this.error = null;
  }

  get loginData(): LoginRequestData {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
