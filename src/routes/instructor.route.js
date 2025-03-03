import { Router } from 'express';
import {
  getAllInstructors,
  getInstructor,
  registerInstructor,
} from '../controllers/instructor.controller.js';
const router = Router();

router.route('/registerInstructer').post(registerInstructor);
router.route('/getAllInstructers').get(getAllInstructors);
router.route('/getInstructer/:instructerId').get(getInstructor);

export default router;
