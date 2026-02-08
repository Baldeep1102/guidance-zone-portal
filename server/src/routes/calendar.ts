import { Router } from 'express';
import * as calendarController from '../controllers/calendar.js';

const router = Router();

router.get('/ics/:courseId', calendarController.getICS);
router.get('/google/:courseId', calendarController.getGoogleLink);

export default router;
