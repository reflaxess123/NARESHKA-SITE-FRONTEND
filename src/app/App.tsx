import { useSessionStore } from "@/entities/session";
import { ProtectedRoute } from "@/features";
import {
  HomePage,
  LoginPage,
  NareshkaPage,
  ProfilePage,
  RegisterPage,
} from "@/pages";
import { APP_ROUTES } from "@/shared";
import { observer } from "mobx-react-lite";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppLayout } from "@/widgets/Layout/AppLayout";

const AppRoutes: React.FC = observer(() => {
  const sessionStore = useSessionStore();

  if (sessionStore.isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTES.HOME.path} element={<HomePage />} />
          <Route path={APP_ROUTES.PROFILE.path} element={<ProfilePage />} />
          <Route path={APP_ROUTES.NARESHKA.path} element={<NareshkaPage />} />
        </Route>
      </Route>
      <Route path={APP_ROUTES.LOGIN.path} element={<LoginPage />} />
      <Route path={APP_ROUTES.REGISTER.path} element={<RegisterPage />} />
    </Routes>
  );
});

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
