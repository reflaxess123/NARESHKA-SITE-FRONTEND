import { useSessionStore } from "@/entities/session";
import { observer } from "mobx-react-lite";
import React from "react";

const HomePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ошибка: пользователь не найден, хотя сессия активна.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Добро пожаловать, {sessionStore.currentUser.email}!
      </h1>
      <p className="text-lg mb-8">
        Вы успешно вошли в систему. Ваш профиль и опция выхода доступны в панели
        навигации.
      </p>
    </div>
  );
};

export const HomePage = observer(HomePageInternal);
