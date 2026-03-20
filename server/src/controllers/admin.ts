import type { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { sendVerificationEmail } from '../services/email.js';

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

export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}

export async function resendVerificationForUser(req: Request, res: Response) {
  try {
    const userId = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({ error: 'User email is already verified' });
      return;
    }

    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken },
    });

    try {
      await sendVerificationEmail(user.email, user.name, emailVerifyToken);
      res.json({ message: `Verification email sent to ${user.email}` });
    } catch (emailErr: any) {
      console.error('Email send failed:', emailErr);
      res.status(500).json({
        error: `Token saved but email failed to send: ${emailErr?.message || 'Unknown email error'}`,
      });
    }
  } catch (err) {
    console.error('Resend verification for user error:', err);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
}
