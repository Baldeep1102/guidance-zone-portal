import client from './client';

export const coursesApi = {
  getAll: () => client.get('/courses'),
  getAllAdmin: () => client.get('/courses/admin'),
  getById: (id: string) => client.get(`/courses/${id}`),
  create: (data: any) => client.post('/courses', data),
  update: (id: string, data: any) => client.put(`/courses/${id}`, data),
  remove: (id: string) => client.delete(`/courses/${id}`),

  // Sessions
  createSession: (courseId: string, data: any) =>
    client.post(`/courses/${courseId}/sessions`, data),
  deleteSession: (courseId: string, sessionId: string) =>
    client.delete(`/courses/${courseId}/sessions/${sessionId}`),

  // Materials
  createMaterial: (courseId: string, data: any) =>
    client.post(`/courses/${courseId}/materials`, data),
  deleteMaterial: (courseId: string, materialId: string) =>
    client.delete(`/courses/${courseId}/materials/${materialId}`),
};
