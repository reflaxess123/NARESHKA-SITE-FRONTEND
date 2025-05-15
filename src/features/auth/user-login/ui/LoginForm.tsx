import { useLoginMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button } from "@/shared/ui"; // Обновленные импорты
import { Stack, Text, TextInput, PasswordInput } from "@mantine/core"; // Дополнительные импорты Mantine
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

  // Используем TextInput и PasswordInput из Mantine, наш Input - это обертка над TextInput
  return (
    // Заменяем className на Stack для управления отступами
    <form
      onSubmit={handleSubmit}
      // className="space-y-4 md:space-y-6 w-full max-w-sm"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <Stack gap="md">
        <TextInput // Используем TextInput напрямую, так как наш Input не добавляет новой логики для type="email"
          label="Электронная почта" // Label теперь проп компонента Mantine
          type="email"
          id="email"
          name="email"
          placeholder="name@company.com"
          value={loginFormStore.email}
          onChange={(e) => loginFormStore.setEmail(e.target.value)}
          disabled={loginMutation.isPending}
          required
          autoComplete="username"
          // className="border-none mt-2" // border-none и mt-2 убираем, стилизуется Mantine
        />
        <PasswordInput // Используем PasswordInput для type="password"
          label="Пароль"
          id="password"
          name="password"
          placeholder="••••••••"
          value={loginFormStore.password}
          onChange={(e) => loginFormStore.setPassword(e.target.value)}
          disabled={loginMutation.isPending}
          required
          autoComplete="current-password"
        />

        {(() => {
          const displayError =
            loginFormStore.error || (loginMutation.error as Error)?.message;
          if (displayError) {
            return (
              // Заменяем className на Mantine Text
              <Text size="sm" c="red" fw={500}>
                {displayError}
              </Text>
            );
          }
          return null;
        })()}

        <Button
          type="submit"
          loading={loginMutation.isPending} // Используем loading проп
          fullWidth // Замена className="w-full"
          variant="filled" // "default" обычно соответствует "filled"
        >
          {loginMutation.isPending ? "Вход..." : "Войти"}
        </Button>
      </Stack>
    </form>
  );
});
