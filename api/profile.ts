import {ChangeUser, User} from '@/types';
import api from "@/api/axios";

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get('/users/me');
  return data.user;
}

export async function updateProfile(updatedData: Partial<ChangeUser>): Promise<User> {
  const { data } = await api.post('/users/me', updatedData);
  return data;
}
