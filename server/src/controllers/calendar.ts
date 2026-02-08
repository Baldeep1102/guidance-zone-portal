import type { Request, Response } from 'express';
import prisma from '../config/database.js';
import { generateICS, getGoogleCalendarUrl } from '../services/calendar.js';

export async function getICS(req: Request, res: Response) {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.courseId as string } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const ics = generateICS(course);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics"`);
    res.send(ics);
  } catch (err) {
    console.error('Generate ICS error:', err);
    res.status(500).json({ error: 'Failed to generate calendar file' });
  }
}

export async function getGoogleLink(req: Request, res: Response) {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.courseId as string } });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const url = getGoogleCalendarUrl(course);
    res.json({ url });
  } catch (err) {
    console.error('Google calendar link error:', err);
    res.status(500).json({ error: 'Failed to generate calendar link' });
  }
}
