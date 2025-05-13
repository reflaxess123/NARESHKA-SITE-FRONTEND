import { User, LoginResponse, RegisterResponse } from "../model/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProfileRequest = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      return (await response.json()) as User;
    }
    return null;
  } catch (error) {
    console.error("Ошибка получения профиля:", error);
    return null;
  }
};

export const loginRequest = async (
  email: string,
  password: string
): Promise<{ success: boolean; data?: LoginResponse; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // После успешного логина, данные пользователя (профиль) будут загружены отдельно в AuthContext
      return { success: true, data: data as LoginResponse };
    } else {
      return { success: false, message: data.message || "Ошибка входа" };
    }
  } catch (error) {
    console.error("Ошибка входа:", error);
    return { success: false, message: "Внутренняя ошибка сервера" };
  }
};

export const registerRequest = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  data?: RegisterResponse;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      // credentials: "include", // Обычно не требуется для регистрации, если сессия устанавливается после
    });
    const data = await response.json();
    if (response.ok) {
      // После успешной регистрации, данные пользователя (профиль) будут загружены отдельно в AuthContext
      return { success: true, data: data as RegisterResponse };
    } else {
      return {
        success: false,
        message: data.message || "Ошибка регистрации",
      };
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return { success: false, message: "Внутренняя ошибка сервера" };
  }
};

export const logoutRequest = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, message: data.message || "Ошибка выхода" };
    }
  } catch (error) {
    console.error("Ошибка выхода:", error);
    return { success: false, message: "Внутренняя ошибка сервера" };
  }
};
