import { useRegisterMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterFormStore } from "../model/RegisterFormStore";

export const RegisterForm: React.FC = observer(() => {
  const [registerFormStore] = useState(() => new RegisterFormStore());
  const sessionStore = useSessionStore();
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // После успешной регистрации API может сразу логинить пользователя или требовать отдельного логина.
      // В useRegisterMutation уже есть invalidateQueries для профиля.
      // Это должно инициировать checkAuthStatus в SessionStore и обновить состояние.
      // Навигация произойдет в useEffect при изменении sessionStore.isAuthenticated
      navigate(APP_ROUTES.LOGIN.path, { replace: true });
    },
    onError: (error) => {
      registerFormStore.setError(
        error.message || "Произошла ошибка при регистрации"
      );
    },
  });

  useEffect(() => {
    if (sessionStore.isAuthenticated && !sessionStore.isSessionLoading) {
      navigate(APP_ROUTES.HOME.path, { replace: true });
    }
  }, [sessionStore.isAuthenticated, sessionStore.isSessionLoading, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerFormStore.setError(null);
    if (!registerFormStore.email || !registerFormStore.password) {
      registerFormStore.setError("Пожалуйста, заполните все поля.");
      return;
    }
    // if (!registerFormStore.validate()) return; // Если есть дополнительная валидация в сторе
    registerMutation.mutate(registerFormStore.registerData);
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
          id="email-register"
          name="email"
          placeholder="name@company.com"
          value={registerFormStore.email}
          onChange={(e) => registerFormStore.setEmail(e.target.value)}
          disabled={registerMutation.isPending}
          required
          autoComplete="username"
        />
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input
          type="password"
          id="password-register"
          name="password"
          placeholder="••••••••"
          value={registerFormStore.password}
          onChange={(e) => registerFormStore.setPassword(e.target.value)}
          disabled={registerMutation.isPending}
          required
          autoComplete="new-password"
        />
      </div>
      {(() => {
        const displayError =
          registerFormStore.error || (registerMutation.error as Error)?.message;
        if (displayError) {
          return (
            <p className="text-sm font-medium text-red-500">{displayError}</p>
          );
        }
        return null;
      })()}

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full"
      >
        {registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
});
