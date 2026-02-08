import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import * as registrationsController from '../controllers/registrations.js';

const router = Router();

router.post('/', authenticate, registrationsController.register);
router.get('/my', authenticate, registrationsController.getMyRegistrations);
router.get('/', authenticate, isAdmin, registrationsController.getAllAdmin);
router.patch('/:id/status', authenticate, isAdmin, registrationsController.updateStatus);

export default router;
