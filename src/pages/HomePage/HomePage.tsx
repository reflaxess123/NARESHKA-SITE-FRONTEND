import { useSessionStore } from "@/entities/session";
import { PageWrapper } from "@/shared";
import { observer } from "mobx-react-lite";
import React from "react";

const HomePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ошибка: данные пользователя не найдены.</p>
      </div>
    );
  }

  return (
    <PageWrapper>
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
