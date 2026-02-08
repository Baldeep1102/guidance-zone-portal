import client from './client';

export const downloadsApi = {
  getAll: () => client.get('/downloads'),
  getById: (id: string) => client.get(`/downloads/${id}`),
  create: (data: any) => client.post('/downloads', data),
  update: (id: string, data: any) => client.put(`/downloads/${id}`, data),
  remove: (id: string) => client.delete(`/downloads/${id}`),
};
