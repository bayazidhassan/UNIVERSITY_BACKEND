import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { courseController } from './course_controller';
import { courseValidation } from './course_validation';
const router = express.Router();

router.post(
  '/createACourse',
  validateRequest(courseValidation.createCourseZodSchema),
  courseController.createACourse,
);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getACourse);
router.patch(
  '/:id',
  validateRequest(courseValidation.updateCourseZodSchema),
  courseController.updateACourse,
);
router.delete('/:id', courseController.deleteACourse);
router.put(
  '/:courseId/assignCourseFaculties',
  validateRequest(courseValidation.courseFacultiesZodSchema),
  courseController.assignCourseFaculties,
);
router.delete(
  '/:courseId/deleteCourseFaculties',
  validateRequest(courseValidation.courseFacultiesZodSchema),
  courseController.deleteCourseFaculties,
);

export const courseRoute = router;
