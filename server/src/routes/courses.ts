import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { createCourseSchema, updateCourseSchema, createSessionSchema, createMaterialSchema } from '../validators/courses.js';
import * as coursesController from '../controllers/courses.js';

const router = Router();

// Public
router.get('/', coursesController.getAll);
router.get('/admin', authenticate, isAdmin, coursesController.getAllAdmin);
router.get('/:id', coursesController.getById);

// Admin CRUD
router.post('/', authenticate, isAdmin, validate(createCourseSchema), coursesController.create);
router.put('/:id', authenticate, isAdmin, validate(updateCourseSchema), coursesController.update);
router.delete('/:id', authenticate, isAdmin, coursesController.remove);

// Sessions
router.post('/:id/sessions', authenticate, isAdmin, validate(createSessionSchema), coursesController.createSession);
router.delete('/:id/sessions/:sessionId', authenticate, isAdmin, coursesController.deleteSession);

// Materials
router.post('/:id/materials', authenticate, isAdmin, validate(createMaterialSchema), coursesController.createMaterial);
router.delete('/:id/materials/:materialId', authenticate, isAdmin, coursesController.deleteMaterial);

export default router;
