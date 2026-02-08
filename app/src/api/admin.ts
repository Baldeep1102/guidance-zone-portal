import client from './client';

export const adminApi = {
  getStats: () => client.get('/admin/stats'),
  getSettings: () => client.get('/admin/settings'),
  updateSettings: (data: any) => client.put('/admin/settings', data),
};
