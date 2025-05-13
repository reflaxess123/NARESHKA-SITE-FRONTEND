import {
  LoginRequestData,
  LoginResponse,
  RegisterRequestData,
  RegisterResponse,
  User,
} from "../model/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Query Key Factories
export const sessionKeys = {
  all: ["session"] as const,
  profile: () => [...sessionKeys.all, "profile"] as const,
  // можно добавить ключи для других данных сессии, если они появятся
};

export const fetchProfile = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    // Если ответ не ok, но это ожидаемый сценарий (например, 401 - не авторизован)
    // TanStack Query по умолчанию рассматривает ответы не 2xx как ошибки.
    // Если 401/403 это "ожидаемое отсутствие данных", а не ошибка, это можно обработать в onSuccess/onError хука useQuery
    // или выбросить кастомную ошибку, чтобы ее отловить.
    // Для простоты, если профиль не найден (401/403), это будет ошибкой для query.
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      errorData.message || `Error fetching profile: ${response.status}`
    );
  }
  return (await response.json()) as User;
};

export const login = async (
  loginData: LoginRequestData
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(loginData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  // Предполагается, что LoginResponse содержит данные пользователя или токен
  // Если LoginResponse содержит User, то можно его сразу вернуть
  // Если только токен, то после этого запроса нужно будет отдельно запросить профиль
  return data as LoginResponse;
};

export const register = async (
  registerData: RegisterRequestData
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  // Аналогично login, RegisterResponse может содержать User или требовать последующего запроса профиля
  return data as RegisterResponse;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(data.message || "Logout failed");
  }
  // logout обычно не возвращает контент
};
