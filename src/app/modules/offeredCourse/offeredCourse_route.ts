import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { offeredCourseController } from './offeredCourse_controller';
import { offeredCourseValidation } from './offeredCourse_validation';
const router = express.Router();

router.post(
  '/createOfferedCourse',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(offeredCourseValidation.createOfferedCourseZodSchema),
  offeredCourseController.createOfferedCourse,
);
router.get('/', offeredCourseController.getAllOfferedCourses);
router.get('/:id', offeredCourseController.getSingleOfferedCourse);
router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(offeredCourseValidation.updateOfferedCourseZodSchema),
  offeredCourseController.updateOfferedCourse,
);
router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  offeredCourseController.deleteAOfferedCourse,
);

export const offeredCourseRoute = router;
