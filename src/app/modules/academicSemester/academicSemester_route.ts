import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterController } from './academicSemester_controller';
import { academicSemesterValidation } from './academicSemester_validation';

const router = express.Router();

router.post(
  '/create_academicSemester',
  validateRequest(academicSemesterValidation.createAcademicSemesterZodSchema),
  academicSemesterController.createAcademicSemester,
);
router.get('/', academicSemesterController.getAllAcademicSemester);
router.get('/:id', academicSemesterController.getAnAcademicSemester);

router.patch(
  '/:id',
  validateRequest(academicSemesterValidation.updateAcademicSemesterZodSchema),
  academicSemesterController.updateAnAcademicSemester,
);

export const academicSemesterRoute = router;
