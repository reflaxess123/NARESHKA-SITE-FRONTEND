import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

// Создаем QueryClient один раз
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false, // Можно настроить по желанию
      retry: 1, // Количество попыток при ошибке
    },
  },
});

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  );
};
