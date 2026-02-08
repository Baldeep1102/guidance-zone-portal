import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { createDownloadSchema, updateDownloadSchema } from '../validators/downloads.js';
import * as downloadsController from '../controllers/downloads.js';

const router = Router();

router.get('/', downloadsController.getAll);
router.get('/:id', downloadsController.getById);
router.post('/', authenticate, isAdmin, validate(createDownloadSchema), downloadsController.create);
router.put('/:id', authenticate, isAdmin, validate(updateDownloadSchema), downloadsController.update);
router.delete('/:id', authenticate, isAdmin, downloadsController.remove);

export default router;
