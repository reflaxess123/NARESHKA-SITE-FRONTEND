import { useLogoutMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();
  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate(APP_ROUTES.LOGIN.path, { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
      alert(error.message || "Не удалось выйти. Попробуйте снова.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка данных пользователя или ошибка...</p>
      </div>
    );
  }

  const { currentUser } = sessionStore;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Профиль пользователя</CardTitle>
          <CardDescription>
            Это ваша защищенная страница профиля.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">ID:</span> {currentUser.id}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p>
              <span className="font-semibold">Дата регистрации:</span>{" "}
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Выход..." : "Выйти"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProfilePage = observer(ProfilePageInternal);
