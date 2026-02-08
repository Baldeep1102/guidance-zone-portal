import { z } from 'zod';

export const createDownloadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().int().optional(),
  thumbnail: z.string().optional(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateDownloadSchema = createDownloadSchema.partial();
