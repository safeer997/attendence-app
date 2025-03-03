import { Router } from 'express';

import {
  createSession,
  getAllSessions,
  getSession,
} from '../controllers/classSession.controller.js';
const router = Router();

router.route('/createSession').post(createSession);
router.route('/getAllSessions').get(getAllSessions);
router.route('/getSession/:sessionId').get(getSession);

export default router;
