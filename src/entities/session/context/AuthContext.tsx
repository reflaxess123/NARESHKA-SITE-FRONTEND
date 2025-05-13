import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchProfileRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../api/authApi"; // Импорт API функций
import {
  User,
  AuthContextType,
  LoginResponse,
  RegisterResponse,
} from "../model/types"; // Импорт типов

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      const userData = await fetchProfileRequest();
      setUser(userData);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: LoginResponse; message?: string }> => {
    const result = await loginRequest(email, password);
    if (result.success) {
      const userData = await fetchProfileRequest();
      setUser(userData);
    }
    return result;
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    data?: RegisterResponse;
    message?: string;
  }> => {
    const result = await registerRequest(email, password);
    if (result.success) {
      const userData = await fetchProfileRequest();
      setUser(userData);
    }
    return result;
  };

  const logout = async (): Promise<{ success: boolean; message?: string }> => {
    const result = await logoutRequest();
    if (result.success) {
      setUser(null);
    }
    return result;
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
