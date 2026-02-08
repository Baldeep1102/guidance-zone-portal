import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import * as usersController from '../controllers/users.js';

const router = Router();

router.get('/', authenticate, isAdmin, usersController.getAll);
router.get('/:id', authenticate, isAdmin, usersController.getById);

export default router;
