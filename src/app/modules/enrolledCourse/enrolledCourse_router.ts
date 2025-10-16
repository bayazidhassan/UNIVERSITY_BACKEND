import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { enrolledCourseController } from './enrolledCourse_Controller';
import { enrolledCourseValidation } from './enrolledCourse_Validation';
const router = express.Router();

router.post(
  '/createEnrolledCourse',
  auth(USER_ROLE.student),
  validateRequest(enrolledCourseValidation.createEnrolledCourseZodSchema),
  enrolledCourseController.createEnrolledCourse,
);

export const enrolledCourseRoutes = router;
