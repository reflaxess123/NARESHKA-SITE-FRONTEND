import { QueryClient } from '@tanstack/react-query';
import { notification } from 'antd';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 404
        ) {
          return false; // Не повторять при ошибках авторизации или "не найдено"
        }
        return failureCount < 3; // Повторять до 3 раз для других ошибок
      },
      refetchOnWindowFocus: false, // Отключить автоматический refetch при фокусе окна
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Произошла ошибка';
        notification.error({
          message: 'Ошибка',
          description: message,
        });
      },
    },
  },
});
