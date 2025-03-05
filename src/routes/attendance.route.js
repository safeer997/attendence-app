import { Router } from 'express';
import { markAttendance } from '../controllers/attendence.controller.js';

const router = Router();

router.route('/getAttendance').get(markAttendance);

export default router;
