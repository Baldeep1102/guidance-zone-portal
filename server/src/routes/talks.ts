import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { createTalkSchema, updateTalkSchema } from '../validators/talks.js';
import * as talksController from '../controllers/talks.js';

const router = Router();

router.get('/', talksController.getAll);
router.get('/:id', talksController.getById);
router.post('/', authenticate, isAdmin, validate(createTalkSchema), talksController.create);
router.put('/:id', authenticate, isAdmin, validate(updateTalkSchema), talksController.update);
router.delete('/:id', authenticate, isAdmin, talksController.remove);

export default router;
