import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projects.js';
import * as projectsController from '../controllers/projects.js';

const router = Router();

router.get('/', projectsController.getAll);
router.get('/:id', projectsController.getById);
router.post('/', authenticate, isAdmin, validate(createProjectSchema), projectsController.create);
router.put('/:id', authenticate, isAdmin, validate(updateProjectSchema), projectsController.update);
router.delete('/:id', authenticate, isAdmin, projectsController.remove);

export default router;
