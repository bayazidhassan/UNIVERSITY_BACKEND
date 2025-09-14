import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { studentController } from './student_controller';
import { studentValidation } from './student_validation';
import { USER_ROLE } from '../user/user_interface';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.student, USER_ROLE.admin),
  studentController.getAllStudent,
);
router.get('/:studentId', studentController.getAStudent);
router.patch(
  '/:studentId',
  validateRequest(studentValidation.updateStudentZodSchema),
  studentController.updateAStudent,
);
router.delete('/:studentId', studentController.deleteAStudent);

export const studentRoutes = router;
