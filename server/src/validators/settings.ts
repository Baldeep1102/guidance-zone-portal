import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  heroImages: z.any().optional(),
  aboutContent: z.any().optional(),
  contactEmail: z.string().email().optional().nullable(),
  socialLinks: z.any().optional(),
  satsangSchedule: z.any().optional(),
  announcementBanner: z.string().optional().nullable(),
  colorScheme: z.any().optional(),
  heroContent: z.any().optional(),
  ctaContent: z.any().optional(),
  footerContent: z.any().optional(),
});
