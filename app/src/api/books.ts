import client from './client';

export const booksApi = {
  getAll: () => client.get('/books'),
  getById: (id: string) => client.get(`/books/${id}`),
  create: (data: any) => client.post('/books', data),
  update: (id: string, data: any) => client.put(`/books/${id}`, data),
  remove: (id: string) => client.delete(`/books/${id}`),
};
