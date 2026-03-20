import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { uploadsDir } from './middleware/upload.js';

import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import talksRoutes from './routes/talks.js';
import booksRoutes from './routes/books.js';
import downloadsRoutes from './routes/downloads.js';
import projectsRoutes from './routes/projects.js';
import registrationsRoutes from './routes/registrations.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import calendarRoutes from './routes/calendar.js';
import prisma from './config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/talks', talksRoutes);
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/downloads', downloadsRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/registrations', registrationsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/calendar', calendarRoutes);

// Public settings endpoint (for CSS variables, hero content, etc.)
app.get('/api/v1/settings', async (_req, res) => {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: 'singleton' } });
    }
    res.json(settings);
  } catch (err) {
    console.error('Public settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// In production, serve the built React frontend
if (env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../app/dist');
  app.use(express.static(clientDist));
  // SPA fallback — serve index.html for any non-API route
  app.get('*path', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(env.PORT, () => {
  console.log(`GuZo server running on http://localhost:${env.PORT}`);
});

export default app;
