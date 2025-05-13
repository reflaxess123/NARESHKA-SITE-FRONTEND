import React from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/entities";
import { ProtectedRoute } from "@/features";
import { HomePage, LoginPage, ProfilePage, RegisterPage } from "@/pages";
import { APP_ROUTES } from "@/shared";
import { Navbar } from "@/widgets";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </>
  );
};

// Отдельный компонент для проверки AuthProvider
// Это необходимо, чтобы использовать useAuth внутри компонента, обернутого AuthProvider
const AppRoutes: React.FC = () => {
  const { loading } = useAuth(); // Пример использования useAuth, если нужно

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={APP_ROUTES.HOME.path} element={<HomePage />} />
        <Route path={APP_ROUTES.LOGIN.path} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER.path} element={<RegisterPage />} />
        <Route path={APP_ROUTES.PROFILE.path} element={<ProtectedRoute />}>
          <Route index element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
