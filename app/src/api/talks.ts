import client from './client';

export const talksApi = {
  getAll: () => client.get('/talks'),
  getById: (id: string) => client.get(`/talks/${id}`),
  create: (data: any) => client.post('/talks', data),
  update: (id: string, data: any) => client.put(`/talks/${id}`, data),
  remove: (id: string) => client.delete(`/talks/${id}`),
};
