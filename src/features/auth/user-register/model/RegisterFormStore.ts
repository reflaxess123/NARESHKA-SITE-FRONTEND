import type { RegisterRequestData } from "@/entities/session";
import { makeAutoObservable } from "mobx";

export class RegisterFormStore {
  email = "";
  password = "";
  // confirmPassword = ''; // Если нужна проверка подтверждения пароля
  error: string | null = null;
  // isLoading будет управляться компонентом через useRegisterMutation.isPending

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setEmail(email: string) {
    this.email = email;
    if (this.error) this.setError(null);
  }

  setPassword(password: string) {
    this.password = password;
    if (this.error) this.setError(null);
  }

  // setConfirmPassword(password: string) {
  //   this.confirmPassword = password;
  //   if (this.error) this.setError(null);
  // }

  setError(error: string | null) {
    this.error = error;
  }

  resetForm() {
    this.email = "";
    this.password = "";
    // this.confirmPassword = '';
    this.error = null;
  }

  get registerData(): RegisterRequestData {
    return {
      email: this.email,
      password: this.password,
    };
  }

  // validate(): boolean {
  //   if (this.password !== this.confirmPassword) {
  //     this.setError('Пароли не совпадают');
  //     return false;
  //   }
  //   return true;
  // }
}
