import React from 'react';
import authStore from './authStore';

export const rootStore = {
  authStore,
  // другие сторы, если будут
};

export const StoreContext = React.createContext(rootStore);

export const useStore = () => {
  return React.useContext(StoreContext);
};
