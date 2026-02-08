import type { Request, Response } from 'express';
import prisma from '../config/database.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getAll(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      where: { visibility: 'PUBLIC' },
      include: {
        materials: { orderBy: { sortOrder: 'asc' } },
        sessions: { orderBy: { date: 'desc' } },
      },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'asc' }],
    });
    res.json(courses);
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

export async function getAllAdmin(_req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        materials: { orderBy: { sortOrder: 'asc' } },
        sessions: { orderBy: { date: 'desc' } },
        _count: { select: { registrations: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(courses);
  } catch (err) {
    console.error('Get all courses (admin) error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: {
        materials: { orderBy: { sortOrder: 'asc' } },
        sessions: { orderBy: { date: 'desc' } },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const data = req.body;
    const course = await prisma.course.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: {
        materials: true,
        sessions: true,
      },
    });
    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const data = req.body;
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const course = await prisma.course.update({
      where: { id: req.params.id as string },
      data,
      include: {
        materials: true,
        sessions: true,
      },
    });
    res.json(course);
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await prisma.course.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

// Sessions sub-routes
export async function createSession(req: Request, res: Response) {
  try {
    const session = await prisma.courseSession.create({
      data: {
        ...req.body,
        date: new Date(req.body.date),
        courseId: req.params.id as string,
      },
    });
    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    await prisma.courseSession.delete({ where: { id: req.params.sessionId as string } });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}

// Materials sub-routes
export async function createMaterial(req: Request, res: Response) {
  try {
    const material = await prisma.courseMaterial.create({
      data: {
        ...req.body,
        courseId: req.params.id as string,
      },
    });
    res.status(201).json(material);
  } catch (err) {
    console.error('Create material error:', err);
    res.status(500).json({ error: 'Failed to create material' });
  }
}

export async function deleteMaterial(req: Request, res: Response) {
  try {
    await prisma.courseMaterial.delete({ where: { id: req.params.materialId as string } });
    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error('Delete material error:', err);
    res.status(500).json({ error: 'Failed to delete material' });
  }
}
