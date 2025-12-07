'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '@/stores';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  userStore: typeof userStore;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Защищенные маршруты - требующие авторизации
const protectedRoutes = ['/profile', '/cart', '/orders', '/admin'];
// Публичные маршруты - доступные без авторизации
const publicRoutes = ['auth/login', 'auth/register', '/forgot-password', '/'];

export const AuthProvider = observer(({ children }: AuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Функция автоматической авторизации
  const autoLogin = async () => {
    try {
      // 1. Проверяем наличие токена в localStorage
      if (!userStore.accessToken) {
        setIsInitialized(true);
        return;
      }

      // 2. Проверяем валидность токена (истек ли он)
      const isTokenValid = checkTokenValidity();
      if (!isTokenValid) {
        console.log('Token expired, attempting refresh...');
        await userStore.refreshToken();
      }

      // 3. Если после refresh все еще нет токена
      if (!userStore.accessToken) {
        console.log('No valid token after refresh');
        userStore.logout();
        setIsInitialized(true);
        return;
      }

      // 4. Загружаем данные пользователя
      // await userStore.forEachtchUserData();

      console.log('Auto-login successful');

    } catch (error) {
      console.error('Auto-login failed:', error);
      // В случае ошибки разлогиниваем
      userStore.logout();
    } finally {
      setIsInitialized(true);
    }
  };

  // Проверка валидности токена
  const checkTokenValidity = (): boolean => {
    if (!userStore.accessToken) return false;

    try {
      // Декодируем токен для проверки expiration
      const tokenParts = userStore.accessToken.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiresAt = payload.exp * 1000; // Конвертируем в миллисекунды

      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  };

  // Обработка редиректов на основе авторизации
  useEffect(() => {
    if (!isInitialized) return;

    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    );
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    );

    // Если пользователь не авторизован и пытается зайти на защищенный маршрут
    if (!userStore.isAuthenticated && isProtectedRoute) {
      router.push('auth/login');
      return;
    }

    // Если пользователь авторизован и пытается зайти на страницы логина/регистрации
    if (userStore.isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/profile?tab=user');
      return;
    }

  }, [pathname, isInitialized, userStore.isAuthenticated, router]);

  // Инициализация при монтировании
  useEffect(() => {
    const initAuth = async () => {
      await autoLogin();
    };

    initAuth();
  }, []);

  // Пока не инициализированы, показываем лоадер
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userStore, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
});

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
