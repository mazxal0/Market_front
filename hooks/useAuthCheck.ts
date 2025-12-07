import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userStore } from '@/stores';

export const useAuthCheck = (requireAuth = true) => {
  const router = useRouter();

  useEffect(() => {
    // Если требуется авторизация, но пользователь не авторизован
    if (requireAuth && !userStore.isAuthenticated) {
      router.push('/login');
    }

    // Если не требуется авторизация, но пользователь авторизован
    if (!requireAuth && userStore.isAuthenticated) {
      router.push('/profile?tab=user');
    }
  }, [requireAuth, router]);

  return userStore.isAuthenticated;
};
