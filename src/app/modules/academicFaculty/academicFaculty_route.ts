import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty_controller';
import { academicFacultyValidation } from './academicFaculty_validation';

const router = express.Router();
router.post(
  '/createAcademicFaculty',
  validateRequest(academicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
);
router.get('/', academicFacultyController.getAllAcademicFaculties);
router.get('/:id', academicFacultyController.getAnAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(academicFacultyValidation),
  academicFacultyController.updateAnAcademicFaculty,
);

export const academicFacultyRoute = router;
