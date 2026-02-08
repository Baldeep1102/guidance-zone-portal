import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { createBookSchema, updateBookSchema } from '../validators/books.js';
import * as booksController from '../controllers/books.js';

const router = Router();

router.get('/', booksController.getAll);
router.get('/:id', booksController.getById);
router.post('/', authenticate, isAdmin, validate(createBookSchema), booksController.create);
router.put('/:id', authenticate, isAdmin, validate(updateBookSchema), booksController.update);
router.delete('/:id', authenticate, isAdmin, booksController.remove);

export default router;
