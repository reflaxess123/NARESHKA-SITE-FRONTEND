import { useLogoutMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES, PageWrapper } from "@/shared";
import { Button } from "@/shared/ui/button";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();
  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate(APP_ROUTES.LOGIN.path, { replace: true });
    },
    onError: (error) => {
      alert(error.message || "Не удалось выйти. Попробуйте снова.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ошибка: пользователь не найден, хотя сессия активна.</p>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="text-1xl text-black">
        <div className="flex justify-end items-center gap-2">
          <Button asChild>
            <Link to={APP_ROUTES.HOME.path} className="hover:text-gray-500">
              Главная
            </Link>
          </Button>
          {sessionStore.isAuthenticated ? (
            <>
              <Button asChild>
                <Link
                  to={APP_ROUTES.NARESHKA.path}
                  className="hover:text-gray-500"
                >
                  Нарешка
                </Link>
              </Button>
              <Button asChild>
                <Link
                  to={APP_ROUTES.PROFILE.path}
                  className="hover:text-gray-500"
                >
                  Профиль ({sessionStore.currentUser?.email})
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant="default"
                disabled={logoutMutation.isPending}
                className="hover:text-gray-500"
              >
                {logoutMutation.isPending ? "Выход..." : "Выйти"}
              </Button>
            </>
          ) : (
            <>
              {!sessionStore.isSessionLoading && (
                <>
                  <Button asChild>
                    <Link
                      to={APP_ROUTES.LOGIN.path}
                      className="hover:text-gray-500"
                    >
                      Вход
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      to={APP_ROUTES.REGISTER.path}
                      className="hover:text-gray-500"
                    >
                      Регистрация
                    </Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4 text-center pt-64">
        <h1 className="text-4xl font-bold mb-6">
          Добро пожаловать, {sessionStore.currentUser.email}!
        </h1>
        <p className="text-lg mb-8">
          Вы успешно вошли в систему. Ваш профиль и опция выхода доступны в
          панели навигации.
        </p>
      </div>
    </PageWrapper>
  );
};

export const HomePage = observer(HomePageInternal);
