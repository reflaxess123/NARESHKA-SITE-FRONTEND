import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/entities";
import { APP_ROUTES } from "@/shared";

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(APP_ROUTES.LOGIN.path);
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Добро пожаловать, {user.email}!
      </h1>
      <p className="text-lg mb-8">
        Вы успешно вошли в систему. Ваш профиль и опция выхода доступны в панели
        навигации.
      </p>
    </div>
  );
};

export default HomePage;
