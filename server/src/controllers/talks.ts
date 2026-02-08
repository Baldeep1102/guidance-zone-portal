import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getAll(_req: Request, res: Response) {
  try {
    const talks = await prisma.talk.findMany({
      orderBy: [{ sortOrder: 'asc' }, { date: 'desc' }],
    });
    res.json(talks);
  } catch (err) {
    console.error('Get talks error:', err);
    res.status(500).json({ error: 'Failed to fetch talks' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const talk = await prisma.talk.findUnique({ where: { id: req.params.id as string } });
    if (!talk) {
      res.status(404).json({ error: 'Talk not found' });
      return;
    }
    res.json(talk);
  } catch (err) {
    console.error('Get talk error:', err);
    res.status(500).json({ error: 'Failed to fetch talk' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const data = req.body;
    const talk = await prisma.talk.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    res.status(201).json(talk);
  } catch (err) {
    console.error('Create talk error:', err);
    res.status(500).json({ error: 'Failed to create talk' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const data = req.body;
    if (data.date) data.date = new Date(data.date);

    const talk = await prisma.talk.update({
      where: { id: req.params.id as string },
      data,
    });
    res.json(talk);
  } catch (err) {
    console.error('Update talk error:', err);
    res.status(500).json({ error: 'Failed to update talk' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await prisma.talk.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Talk deleted' });
  } catch (err) {
    console.error('Delete talk error:', err);
    res.status(500).json({ error: 'Failed to delete talk' });
  }
}
