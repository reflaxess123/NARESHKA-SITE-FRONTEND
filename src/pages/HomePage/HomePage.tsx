import { useSessionStore } from "@/entities/session";
import { PageWrapper } from "@/shared";
import { observer } from "mobx-react-lite";
import React from "react";
import { AuthForm } from "@/widgets/AuthForm/AuthForm";
import { useLocation, Navigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared";
import { AnimatedLinesBackground } from "@/components/magicui/AnimatedLinesBackground";

const HomePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();
  const location = useLocation();

  if (!sessionStore.currentUser) {
    let initialMode: "login" | "register" = "login";
    if (location.pathname === APP_ROUTES.REGISTER.path) {
      initialMode = "register";
    }
    return (
      <div className="relative flex items-center justify-center min-h-screen">
        <AnimatedLinesBackground />
        <AuthForm initialMode={initialMode} />
      </div>
    );
  }

  if (
    location.pathname === APP_ROUTES.LOGIN.path ||
    location.pathname === APP_ROUTES.REGISTER.path
  ) {
    return <Navigate to={APP_ROUTES.HOME.path} replace />;
  }

  return (
    <PageWrapper className="relative">
      <div className="relative z-0 flex flex-col items-center justify-center p-4 text-center">
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
