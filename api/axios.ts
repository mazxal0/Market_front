import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { userStore } from '@/stores';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // cookies будут отправляться автоматически
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// Добавляем accessToken из userStore к каждому запросу
api.interceptors.request.use((config) => {
  const token = userStore.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Обработка 401 и refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refreshToken в cookie отправляется автоматически
        const { data } = await axios.post(
          'http://localhost:8080/auth/refresh',
          {},
          { withCredentials: true }
        );

        // обновляем токен в userStore и localStorage
        userStore.accessToken = data.accessToken;
        userStore.saveToStorage();

        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;

        processQueue(null, data.accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
