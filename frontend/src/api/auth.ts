import api from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  register: async (fullName: string, email: string, password: string, phone?: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { fullName, email, password, phone });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (body: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    const { data } = await api.put('/auth/profile', body);
    return data;
  },
};
