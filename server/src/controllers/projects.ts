import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getAll(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id as string } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await prisma.project.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}
