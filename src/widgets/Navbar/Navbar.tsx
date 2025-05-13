import { useLogoutMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button } from "@/shared/ui/button";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarInternal: React.FC = () => {
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

  return (
    <nav className="bg-gray-100 text-1xl text-black p-4 shadow-md pr-10">
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
                to={APP_ROUTES.PROFILE.path}
                className="hover:text-gray-500"
              >
                Профиль ({sessionStore.currentUser?.email})
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              disabled={logoutMutation.isPending}
              className="hover:text-gray-500 text-black"
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
    </nav>
  );
};

export const Navbar = observer(NavbarInternal);
