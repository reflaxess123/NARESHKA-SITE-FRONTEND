import { useSessionStore } from "@/entities";
import { APP_ROUTES } from "@/shared";
import { observer } from "mobx-react-lite";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteInternal: React.FC = () => {
  const sessionStore = useSessionStore();

  if (sessionStore.isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Проверка сессии...</p>
      </div>
    );
  }

  if (!sessionStore.isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN.path} replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = observer(ProtectedRouteInternal);
