import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional().default('Acharya Navneetji'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().optional(),
  publishYear: z.number().int().min(1900).max(2100),
  category: z.string().min(1, 'Category is required'),
  purchaseLink: z.string().optional(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateBookSchema = createBookSchema.partial();
