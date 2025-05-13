import { useLoginMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button } from "@/shared/ui/button"; // Предполагаем наличие этих компонентов
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginFormStore } from "../model/LoginFormStore";

export const LoginForm: React.FC = observer(() => {
  // Используем useState для создания экземпляра стора один раз при монтировании
  // Это соответствует вашей идее "не синглтон, а new MobxMiniStore()"
  const [loginFormStore] = useState(() => new LoginFormStore());
  const sessionStore = useSessionStore();
  const navigate = useNavigate();

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      // В useLoginMutation уже есть invalidateQueries для профиля.
      // sessionStore.checkAuthStatus() вызовет перезапрос профиля.
      sessionStore.checkAuthStatus(); // Принудительно проверяем статус сессии (запросим профиль)
      // Навигация после успешного обновления состояния сессии произойдет через useEffect.
    },
    onError: (error) => {
      loginFormStore.setError(error.message || "Произошла ошибка при входе");
    },
  });

  // Навигация после изменения isAuthenticated
  useEffect(() => {
    if (sessionStore.isAuthenticated && !sessionStore.isSessionLoading) {
      navigate(APP_ROUTES.HOME.path, { replace: true });
    }
  }, [sessionStore.isAuthenticated, sessionStore.isSessionLoading, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginFormStore.setError(null); // Сброс предыдущей ошибки
    if (!loginFormStore.email || !loginFormStore.password) {
      loginFormStore.setError("Пожалуйста, заполните все поля.");
      return;
    }
    loginMutation.mutate(loginFormStore.loginData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6 w-full max-w-sm"
    >
      <div>
        <Label htmlFor="email">Электронная почта</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="name@company.com"
          value={loginFormStore.email}
          onChange={(e) => loginFormStore.setEmail(e.target.value)}
          disabled={loginMutation.isPending}
          required
          autoComplete="username"
        />
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          value={loginFormStore.password}
          onChange={(e) => loginFormStore.setPassword(e.target.value)}
          disabled={loginMutation.isPending}
          required
          autoComplete="current-password"
        />
      </div>

      {(() => {
        const displayError =
          loginFormStore.error || (loginMutation.error as Error)?.message;
        if (displayError) {
          return (
            <p className="text-sm font-medium text-red-500">{displayError}</p>
          );
        }
        return null;
      })()}

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full"
      >
        {loginMutation.isPending ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
});
