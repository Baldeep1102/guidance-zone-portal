import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getAll(_req: Request, res: Response) {
  try {
    const books = await prisma.book.findMany({
      orderBy: [{ sortOrder: 'asc' }, { publishYear: 'desc' }],
    });
    res.json(books);
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.id as string } });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const book = await prisma.book.create({ data: req.body });
    res.status(201).json(book);
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ error: 'Failed to create book' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(book);
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ error: 'Failed to update book' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await prisma.book.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
}
