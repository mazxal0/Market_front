import { User } from '@/types';
import api from "@/api/axios";

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get('/users/me');
  return data.user;
}

export async function updateProfile(updatedData: Partial<User>): Promise<User> {
  const { data } = await api.put('/api/profile', updatedData);
  return data;
}
