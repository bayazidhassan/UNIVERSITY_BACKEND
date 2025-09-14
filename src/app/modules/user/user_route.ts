import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidation } from '../admin/admin_validation';
import { facultyValidation } from '../faculty/faculty_validation';
import { studentValidation } from '../student/student_validation';
import { userControllers } from './user_controller';
import { USER_ROLE } from './user_interface';

const router = express.Router();

router.post(
  '/create_student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidation.createStudentZodSchema),
  userControllers.createStudent,
);
router.post(
  '/create_faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidation.createFacultyZodSchema),
  userControllers.createFaculty,
);

router.post(
  '/create_admin',
  validateRequest(adminValidation.createAdminZodSchema),
  userControllers.createAdmin,
);

export const userRoutes = router;
