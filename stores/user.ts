import { makeAutoObservable, runInAction } from 'mobx';
import { UserRegistration } from '@/types';
import {jwtDecode} from 'jwt-decode';
import {cartStore} from "@/stores/cartStore";
import axios from "@/api/axios";

interface AccessTokenPayload {
  user_id: string;
  role: Role;
  name: string;
  cart_id: string;
  exp?: number;
  iat?: number;
}

enum Role {
  Admin = 'admin',
  User = 'user'
}

export class UserStore {
  userId: string = '';
  name: string = '';
  role: Role = Role.User;
  cartId: string = '';
  accessToken: string | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  private readonly API_URL = 'http://127.0.0.1:8080';

  constructor() {
    this.error = null
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('user');
    if (saved) {
      const data = JSON.parse(saved);

      runInAction(() => {
        this.userId = data.userId || '';
        this.name = data.name || '';
        this.cartId = data.cartId || '';
        this.role = data.role || '';
        this.accessToken = data.accessToken || null;
        this.isAuthenticated = !!data.accessToken && this.checkTokenValidity(data.accessToken);
      });
    }
  }

  public saveToStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'user',
      JSON.stringify({
        userId: this.userId,
        cartId: this.cartId,
        name: this.name,
        role: this.role,
        accessToken: this.accessToken,
      })
    );
  }

  // ========== AUTH METHODS ==========

  async login(email: string, password: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // refreshToken в cookie
      });

      if (!response.ok) throw new Error('Неправильные данные пользователя');

      const data = await response.json();

      runInAction(() => {
        this.userId = data.userId;
        this.name = data.name;
        this.accessToken = data.accessToken;
        this.isAuthenticated = true;
        this.error = null;
        this.saveToStorage();
      });

      return data;
    } catch (err) {
      runInAction(() => {
        if (err instanceof Error) this.error = err.message;
        else this.error = 'Неизвестная ошибка';
      });
      throw err;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async register(values: UserRegistration) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      // читаем тело один раз
      const data = await response.json();

      if (!response.ok) {
        // если сервер вернул ошибку
        const message =  data?.message || 'Ошибка регистрации';
        runInAction(() => {
          this.error = message;
        });
        throw new Error(message);
      }

      // регистрация успешна
      runInAction(() => {
        this.userId = data.userId;
        this.name = data.name;
        this.accessToken = data.accessToken;
        this.isAuthenticated = true;
        this.saveToStorage();
      });

      return data;
    } catch (err) {
      runInAction(() => {
        if (err instanceof Error) this.error = err.message;
        else this.error = 'Неизвестная ошибка регистрации';
      });
      throw err;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }


  async logout() {
    try {
      await fetch(`${this.API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    runInAction(() => {
      this.userId = '';
      this.name = '';
      this.accessToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
    });
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // cookie
      });

      if (!response.ok) throw new Error('Refresh failed');

      const data = await response.json();

      const { access_token } = data;
      if (!access_token) throw new Error('Access token не получен');

      const decoded = jwtDecode<AccessTokenPayload>(access_token);
      runInAction(() => {
        this.userId = decoded.user_id;
        this.role = decoded.role;
        this.name = decoded.name;
        this.cartId = decoded.cart_id
        this.accessToken = access_token;
        this.isAuthenticated = true;
        cartStore.setCartId(decoded.cart_id)
        this.saveToStorage();
      });

      return data;
    } catch (err) {
      console.error('Refresh token error:', err);
      this.logout();
      return null;
    }
  }

  // ===== SECOND FACTOR AUTH =====
  async secondFAMethod(code: string, email: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(`${this.API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Невалидный ответ сервера: ${responseText}`);
      }

      if (!response.ok) {
        const errorMessage = data?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      // ===== Работа с JWT =====
      const { access_token } = data;
      if (!access_token) throw new Error('Access token не получен');

      const decoded = jwtDecode<AccessTokenPayload>(access_token);
      runInAction(() => {
        this.userId = decoded.user_id;
        this.role = decoded.role;
        this.name = decoded.name;
        this.cartId = decoded.cart_id
        this.accessToken = access_token;
        this.isAuthenticated = true;
        cartStore.setCartId(decoded.cart_id)
        this.saveToStorage();
      });

      return data;
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) this.error = error.message;
        else this.error = 'Неизвестная ошибка подтверждения кода';
      });
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // ========== GETTERS ==========

  get displayName(): string {
    return this.name || 'Гость';
  }

  get initials(): string {
    if (!this.name) return 'Г';
    return this.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private checkTokenValidity(token: string): boolean {
    try {
      const payload = jwtDecode<AccessTokenPayload>(token);
      if (!payload.exp) return true;
      const expiresAt = payload.exp * 1000;
      return Date.now() < expiresAt - 5 * 60 * 1000; // запас 5 минут
    } catch {
      return false;
    }
  }
}

// Экспорт одного экземпляра
export const userStore = new UserStore();
