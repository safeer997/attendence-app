import { Router } from 'express';
import { markAttendance } from '../controllers/attendence.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/:sessionId').get(authenticateUser, markAttendance);

export default router;
