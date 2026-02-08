import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getStats(_req: Request, res: Response) {
  try {
    const [totalUsers, totalCourses, totalTalks, totalBooks, totalRegistrations, totalDownloads, totalProjects] =
      await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.talk.count(),
        prisma.book.count(),
        prisma.registration.count(),
        prisma.download.count(),
        prisma.project.count(),
      ]);

    const recentRegistrations = await prisma.registration.findMany({
      take: 5,
      orderBy: { registrationDate: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.json({
      totalUsers,
      totalCourses,
      totalTalks,
      totalBooks,
      totalRegistrations,
      totalDownloads,
      totalProjects,
      recentRegistrations,
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

export async function getSettings(_req: Request, res: Response) {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: 'singleton' } });
    }
    res.json(settings);
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: req.body,
      create: { id: 'singleton', ...req.body },
    });
    res.json(settings);
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}
