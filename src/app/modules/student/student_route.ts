import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { studentController } from './student_controller';
import { studentValidation } from './student_validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.student, USER_ROLE.admin),
  studentController.getAllStudent,
);
router.get('/:studentId', studentController.getAStudent);
router.patch(
  '/:studentId',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(studentValidation.updateStudentZodSchema),
  studentController.updateAStudent,
);
router.delete(
  '/:studentId',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  studentController.deleteAStudent,
);

export const studentRoutes = router;
