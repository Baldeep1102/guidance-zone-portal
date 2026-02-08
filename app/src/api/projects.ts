import client from './client';

export const projectsApi = {
  getAll: () => client.get('/projects'),
  getById: (id: string) => client.get(`/projects/${id}`),
  create: (data: any) => client.post('/projects', data),
  update: (id: string, data: any) => client.put(`/projects/${id}`, data),
  remove: (id: string) => client.delete(`/projects/${id}`),
};
