import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  instructor: z.string().optional().default('Acharya Navneetji'),
  duration: z.string().min(1, 'Duration is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean().optional().default(true),
  maxParticipants: z.number().int().positive().optional().default(50),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional().default('NONE'),
  recurrenceDays: z.string().optional(),
  sessionTime: z.string().optional(),
  sessionDuration: z.number().int().positive().optional(),
  timezone: z.string().optional().default('Asia/Kolkata'),
  joinLink: z.string().optional(),
  paymentLink: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional().default('PUBLIC'),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  recordingUrl: z.string().optional(),
});

export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['video', 'pdf', 'audio', 'link']).default('pdf'),
  url: z.string().min(1, 'URL is required'),
  description: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
});
