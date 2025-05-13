import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/entities";
import { APP_ROUTES } from "@/shared";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate(APP_ROUTES.LOGIN.path);
    } else {
      // Можно добавить обработку ошибок, если выход не удался
      console.error(result.message || "Не удалось выйти");
      alert(result.message || "Не удалось выйти. Попробуйте снова.");
    }
  };

  if (!user) {
    // Это состояние не должно возникать, если ProtectedRoute работает корректно
    return <p>Пожалуйста, войдите, чтобы увидеть эту страницу.</p>;
  }

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
              <span className="font-semibold">ID:</span> {user.id}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Дата регистрации:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Выйти
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
