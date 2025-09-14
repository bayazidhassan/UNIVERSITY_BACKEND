import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseController } from './offeredCourse_controller';
import { offeredCourseValidation } from './offeredCourse_validation';
const router = express.Router();

router.post(
  '/createOfferedCourse',
  validateRequest(offeredCourseValidation.createOfferedCourseZodSchema),
  offeredCourseController.createOfferedCourse,
);
router.get('/', offeredCourseController.getAllOfferedCourses);
router.get('/:id', offeredCourseController.getSingleOfferedCourse);
router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updateOfferedCourseZodSchema),
  offeredCourseController.updateOfferedCourse,
);
router.delete('/:id', offeredCourseController.deleteAOfferedCourse);

export const offeredCourseRoute = router;
