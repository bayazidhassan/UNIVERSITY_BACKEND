import express from 'express';
import { enrolledCourseController } from './enrolledCourse_Controller';
const router = express.Router();

router.post('/', enrolledCourseController.createEnrolledCourse);

export const enrolledCourseRoutes = router;
