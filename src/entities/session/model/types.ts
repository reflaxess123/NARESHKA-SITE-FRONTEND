import React from "react";

// Определяем типы для пользователя и контекста
export interface User {
  id: number;
  email: string;
  createdAt: string;
  // Добавьте другие поля пользователя, если они есть
}

// Типы для ответов API
export interface LoginResponse {
  message: string;
  userId: number;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

// Типы для данных запроса
export interface LoginRequestData {
  email: string;
  password: string;
}

export interface RegisterRequestData {
  email: string;
  password: string;
  // Если есть другие поля для регистрации, например, username, добавьте их сюда
}

export interface AuthContextType {
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
