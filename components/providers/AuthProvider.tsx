'use client';

import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '@/stores';

function isValid(accessToken: string | null) {
  if (!accessToken) return false;

  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

export const AuthProvider = observer(function InitAuth() {
  useEffect(() => {
    const run = async () => {
      const token = userStore.accessToken;
      // токена нет → пробуем refresh
      if (!isValid(token)) {
         await userStore.refreshToken();
      }
    };

    run();
  }, []);

  return null;
});
