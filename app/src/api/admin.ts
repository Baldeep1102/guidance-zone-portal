import client from './client';

export const adminApi = {
  getStats: () => client.get('/admin/stats'),
  getSettings: () => client.get('/admin/settings'),
  updateSettings: (data: any) => client.put('/admin/settings', data),
  uploadFile: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return client.post<{ url: string }>('/admin/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  resendVerificationForUser: (userId: string) =>
    client.post<{ message: string }>(`/admin/users/${userId}/resend-verification`),
};
