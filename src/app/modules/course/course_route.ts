import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { courseController } from './course_controller';
import { courseValidation } from './course_validation';
const router = express.Router();

router.post(
  '/createACourse',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(courseValidation.createCourseZodSchema),
  courseController.createACourse,
);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getACourse);
router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(courseValidation.updateCourseZodSchema),
  courseController.updateACourse,
);
router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  courseController.deleteACourse,
);
router.put(
  '/:courseId/assignCourseFaculties',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(courseValidation.courseFacultiesZodSchema),
  courseController.assignCourseFaculties,
);
router.get(
  '/:courseId/getCourseFaculties',
  courseController.getCourseFaculties,
);
router.delete(
  '/:courseId/deleteCourseFaculties',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(courseValidation.courseFacultiesZodSchema),
  courseController.removeCourseFaculties,
);

export const courseRoute = router;
