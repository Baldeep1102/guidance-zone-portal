import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getAll(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        authProvider: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        authProvider: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        registrations: {
          include: { course: { select: { id: true, title: true } } },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
