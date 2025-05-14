import { useSessionStore } from "@/entities/session";
import { ProtectedRoute } from "@/features";
import { HomePage, LoginPage, ProfilePage, RegisterPage } from "@/pages";
import { APP_ROUTES } from "@/shared";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

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
      <Route element={<Layout />}>
        <Route path={APP_ROUTES.HOME.path} element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path={APP_ROUTES.LOGIN.path} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER.path} element={<RegisterPage />} />
        <Route path={APP_ROUTES.PROFILE.path} element={<ProtectedRoute />}>
          <Route index element={<ProfilePage />} />
        </Route>
      </Route>
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
