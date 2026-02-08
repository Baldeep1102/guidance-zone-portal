import client from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string | null;
  emailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  signup: (data: { name: string; email: string; password: string; phone?: string }) =>
    client.post<{ message: string; user: AuthUser }>('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    client.post<AuthResponse>('/auth/login', data),

  googleLogin: (idToken: string) =>
    client.post<AuthResponse>('/auth/google', { idToken }),

  refresh: () =>
    client.post<AuthResponse>('/auth/refresh'),

  verifyEmail: (token: string) =>
    client.get<{ message: string }>(`/auth/verify-email?token=${token}`),

  forgotPassword: (email: string) =>
    client.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    client.post<{ message: string }>('/auth/reset-password', { token, password }),

  me: () =>
    client.get<{ user: AuthUser }>('/auth/me'),
};
