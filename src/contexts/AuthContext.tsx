import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Определяем типы для пользователя и контекста
interface User {
  id: number;
  email: string;
  createdAt: string;
  // Добавьте другие поля пользователя, если они есть
}

// Типы для ответов API
interface LoginResponse {
  message: string;
  userId: number;
}

interface RegisterResponse {
  message: string;
  userId: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: LoginResponse; message?: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: RegisterResponse; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = (await response.json()) as User;
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Ошибка проверки статуса аутентификации:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: LoginResponse; message?: string }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const profileResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (profileResponse.ok) {
          const userData = (await profileResponse.json()) as User;
          setUser(userData);
        } else {
          setUser(null);
          console.error(
            "Не удалось получить профиль пользователя после входа."
          );
        }
        return { success: true, data: data as LoginResponse };
      } else {
        return { success: false, message: data.message || "Ошибка входа" };
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      return { success: false, message: "Внутренняя ошибка сервера" };
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    data?: RegisterResponse;
    message?: string;
  }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const profileResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (profileResponse.ok) {
          const userData = (await profileResponse.json()) as User;
          setUser(userData);
        } else {
          setUser(null);
          console.error(
            "Не удалось получить профиль пользователя после регистрации."
          );
        }
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

  const logout = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        setUser(null);
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

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
