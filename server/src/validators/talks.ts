import { z } from 'zod';

export const createTalkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  youtubeUrl: z.string().min(1, 'YouTube URL is required'),
  thumbnail: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  date: z.string().min(1, 'Date is required'),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateTalkSchema = createTalkSchema.partial();
