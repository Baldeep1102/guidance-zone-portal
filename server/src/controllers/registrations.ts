import type { Request, Response } from 'express';
import prisma from '../config/database.js';
import type { AuthRequest } from '../middleware/auth.js';
import { sendRegistrationConfirmation } from '../services/email.js';
import { getGoogleCalendarUrl } from '../services/calendar.js';
import { env } from '../config/env.js';

export async function register(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { courseId } = req.body;
    const userId = req.user.userId;

    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      res.status(409).json({ error: 'Already registered for this course' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course.maxParticipants && course.registeredCount >= course.maxParticipants) {
      res.status(400).json({ error: 'Course is full' });
      return;
    }

    const [registration] = await prisma.$transaction([
      prisma.registration.create({
        data: { userId, courseId, status: 'CONFIRMED' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: true,
        },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: { registeredCount: { increment: 1 } },
      }),
    ]);

    // Send confirmation email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const calendarUrl = `${env.CLIENT_URL}/api/v1/calendar/ics/${courseId}`;
      sendRegistrationConfirmation(
        user.email,
        user.name,
        course.title,
        course.joinLink,
        calendarUrl,
      ).catch(err => console.error('Failed to send registration email:', err));
    }

    res.status(201).json(registration);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
}

export async function getMyRegistrations(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: req.user.userId },
      include: {
        course: {
          include: {
            materials: { orderBy: { sortOrder: 'asc' } },
            sessions: { orderBy: { date: 'desc' } },
          },
        },
      },
      orderBy: { registrationDate: 'desc' },
    });

    res.json(registrations);
  } catch (err) {
    console.error('Get my registrations error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

export async function getAllAdmin(_req: Request, res: Response) {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { registrationDate: 'desc' },
    });

    res.json(registrations);
  } catch (err) {
    console.error('Get all registrations error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const registration = await prisma.registration.update({
      where: { id: req.params.id as string },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: true,
      },
    });

    res.json(registration);
  } catch (err) {
    console.error('Update registration status error:', err);
    res.status(500).json({ error: 'Failed to update registration' });
  }
}
