// Enum для путей приложения
export enum AppRoutePath {
  Home = "/",
  Login = "/login",
  Register = "/register",
  Profile = "/profile",
  Nareshka = "/nareshka",
  Theory = "/theory",
  TheoryReview = "/theory/review",
}

// Тип для одного элемента конфигурации роута
export interface RouteConfigItem {
  path: AppRoutePath;
  // Здесь можно добавить другие поля, например: title?: string; icon?: string;
}

// Тип для всей конфигурации роутов
// Используем тот же enum для ключей для удобства и строгости
export enum AppRoute {
  Home = "HOME",
  Login = "LOGIN",
  Register = "REGISTER",
  Profile = "PROFILE",
  Nareshka = "NARESHKA",
  Theory = "THEORY",
  TheoryReview = "THEORY_REVIEW",
}

export const APP_ROUTES: Record<AppRoute, RouteConfigItem> = {
  [AppRoute.Home]: { path: AppRoutePath.Home },
  [AppRoute.Login]: { path: AppRoutePath.Login },
  [AppRoute.Register]: { path: AppRoutePath.Register },
  [AppRoute.Profile]: { path: AppRoutePath.Profile },
  [AppRoute.Nareshka]: { path: AppRoutePath.Nareshka },
  [AppRoute.Theory]: { path: AppRoutePath.Theory },
  [AppRoute.TheoryReview]: { path: AppRoutePath.TheoryReview },
};

export const ROUTES = {
  HOME: "/",
  NARESHKA: "/nareshka",
  THEORY: "/theory",
  THEORY_REVIEW: "/theory/review",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;
