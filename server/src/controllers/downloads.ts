import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getAll(_req: Request, res: Response) {
  try {
    const downloads = await prisma.download.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(downloads);
  } catch (err) {
    console.error('Get downloads error:', err);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const download = await prisma.download.findUnique({ where: { id: req.params.id as string } });
    if (!download) {
      res.status(404).json({ error: 'Download not found' });
      return;
    }
    res.json(download);
  } catch (err) {
    console.error('Get download error:', err);
    res.status(500).json({ error: 'Failed to fetch download' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const download = await prisma.download.create({ data: req.body });
    res.status(201).json(download);
  } catch (err) {
    console.error('Create download error:', err);
    res.status(500).json({ error: 'Failed to create download' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const download = await prisma.download.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(download);
  } catch (err) {
    console.error('Update download error:', err);
    res.status(500).json({ error: 'Failed to update download' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await prisma.download.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Download deleted' });
  } catch (err) {
    console.error('Delete download error:', err);
    res.status(500).json({ error: 'Failed to delete download' });
  }
}
