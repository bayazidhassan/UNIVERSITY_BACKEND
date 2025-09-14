import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentController } from './academicDepartment_controller';
import { academicDepartmentValidation } from './academicDepartment_validation';

const router = express.Router();
router.post(
  '/createAcademicFaculty',
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.createAcademicDepartment,
);
router.get('/', academicDepartmentController.getAllAcademicDepartments);
router.get('/:id', academicDepartmentController.getAnAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.updateAnAcademicDepartment,
);

export const academicDepartmentRoute = router;
