import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { updateSettingsSchema } from '../validators/settings.js';
import * as adminController from '../controllers/admin.js';

const router = Router();

router.get('/stats', authenticate, isAdmin, adminController.getStats);
router.get('/settings', authenticate, isAdmin, adminController.getSettings);
router.put('/settings', authenticate, isAdmin, validate(updateSettingsSchema), adminController.updateSettings);

export default router;
