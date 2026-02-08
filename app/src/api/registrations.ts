import client from './client';

export const registrationsApi = {
  register: (courseId: string) =>
    client.post('/registrations', { courseId }),
  getMy: () =>
    client.get('/registrations/my'),
  getAll: () =>
    client.get('/registrations'),
  updateStatus: (id: string, status: string) =>
    client.patch(`/registrations/${id}/status`, { status }),
};
