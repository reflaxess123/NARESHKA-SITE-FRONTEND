import { useStores } from "@/app/providers/StoreProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  fetchProfile,
  sessionKeys,
} from "../api/authApi";
import {
  LoginRequestData,
  LoginResponse,
  RegisterRequestData,
  RegisterResponse,
  User,
} from "../model/types";

// Hook to fetch user profile
export const useUserProfile = (options?: {
  enabled?: boolean;
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
}) => {
  return useQuery<User, Error>({
    queryKey: sessionKeys.profile(),
    queryFn: fetchProfile,
    ...options,
  });
};

// Hook for login mutation
export const useLoginMutation = (options?: {
  onSuccess?: (data: LoginResponse, variables: LoginRequestData) => void;
  onError?: (error: Error, variables: LoginRequestData) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginRequestData>({
    mutationFn: apiLogin,
    onSuccess: (data, variables) => {
      // После успешного логина можно инвалидировать и заново запросить профиль
      queryClient.invalidateQueries({ queryKey: sessionKeys.profile() });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
};

// Hook for register mutation
export const useRegisterMutation = (options?: {
  onSuccess?: (data: RegisterResponse, variables: RegisterRequestData) => void;
  onError?: (error: Error, variables: RegisterRequestData) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<RegisterResponse, Error, RegisterRequestData>({
    mutationFn: apiRegister,
    onSuccess: (data, variables) => {
      // После успешной регистрации можно инвалидировать и заново запросить профиль
      // (если API сразу логинит пользователя)
      queryClient.invalidateQueries({ queryKey: sessionKeys.profile() });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
};

// Hook for logout mutation
export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const { sessionStore } = useStores();

  return useMutation<void, Error, void>({
    mutationFn: apiLogout,
    onSuccess: () => {
      // После успешного выхода очищаем все данные сессии и профиль
      queryClient.removeQueries({ queryKey: sessionKeys.profile() });
      sessionStore.clearSession();
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
