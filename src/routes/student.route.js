import { Router } from 'express';
import {
  getAllStudents,
  getStudent,
  registerStudent,
} from '../controllers/student.controller.js';
const router = Router();

router.route('/registerStudent').post(registerStudent);
router.route('/getAllStudents').get(getAllStudents);
router.route('/getStudent/:studentId').get(getStudent);

export default router;
