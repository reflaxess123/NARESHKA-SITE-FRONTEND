import { queryClient } from "@/app/providers/QueryProvider";
import React, { createContext, useContext } from "react";
import { RootStore } from "./RootStore";

interface StoreProviderProps {
  children: React.ReactNode;
}

// Создаем инстанс RootStore, передавая queryClient
const store = new RootStore(queryClient);

const StoreContext = createContext<RootStore | undefined>(undefined);

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

// Хук для использования сторов в компонентах
export const useStores = (): RootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStores must be used within a StoreProvider");
  }
  return context;
};
