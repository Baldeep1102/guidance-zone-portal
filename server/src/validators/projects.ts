import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['ONGOING', 'COMPLETED', 'UPCOMING']).optional().default('ONGOING'),
  location: z.string().optional(),
  impactStats: z.any().optional(),
  gallery: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();
