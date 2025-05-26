import { useSessionStore } from "@/entities/session";
import { ProtectedRoute } from "@/features";
import {
  HomePage,
  NareshkaPage,
  ProfilePage,
  TheoryPage,
  TheoryReviewPage,
} from "@/pages";
import { APP_ROUTES } from "@/shared";
import { AppLayout } from "@/widgets/Layout/AppLayout";
import { observer } from "mobx-react-lite";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
        <Route path={APP_ROUTES.HOME.path} element={<HomePage />} />
        <Route path={APP_ROUTES.LOGIN.path} element={<HomePage />} />
        <Route path={APP_ROUTES.REGISTER.path} element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTES.PROFILE.path} element={<ProfilePage />} />
          <Route path={APP_ROUTES.NARESHKA.path} element={<NareshkaPage />} />
          <Route path={APP_ROUTES.THEORY.path} element={<TheoryPage />} />
          <Route path="/theory/review" element={<TheoryReviewPage />} />
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
