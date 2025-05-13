import { makeAutoObservable, runInAction } from 'mobx';
import apiClient from '../services/api';

interface User {
  id: number;
  email: string;
  createdAt: string;
}

class AuthStore {
  user: User | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = true; // Для начальной проверки сессии

  constructor() {
    makeAutoObservable(this);
    this.checkAuthStatus(); // Проверка при инициализации
  }

  async login(email_param: string, password_param: string) {
    const response = await apiClient.post('/auth/login', {
      email: email_param,
      password: password_param,
    });
    if (response.data && response.data.userId) {
      await this.fetchProfile();
    }
  }

  async register(email_param: string, password_param: string) {
    const response = await apiClient.post('/auth/register', {
      email: email_param,
      password: password_param,
    });
    if (response.data && response.data.userId) {
      await this.fetchProfile();
    }
  }

  async logout() {
    await apiClient.post('/auth/logout');
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  }

  async fetchProfile() {
    try {
      const response = await apiClient.get<User>('/api/profile');
      runInAction(() => {
        this.user = response.data;
        this.isAuthenticated = true;
      });
    } catch (error) {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
      console.error('Failed to fetch profile', error);
    }
  }

  async checkAuthStatus() {
    this.isLoading = true;
    try {
      await this.fetchProfile();
    } catch (error) {
      // Ошибка при fetchProfile уже обрабатывается там
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

const authStore = new AuthStore();
export default authStore;
