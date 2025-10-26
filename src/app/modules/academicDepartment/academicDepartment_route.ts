import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { academicDepartmentController } from './academicDepartment_controller';
import { academicDepartmentValidation } from './academicDepartment_validation';

const router = express.Router();
router.post(
  '/createAcademicFaculty',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.createAcademicDepartment,
);
router.get('/', academicDepartmentController.getAllAcademicDepartments);
router.get('/:id', academicDepartmentController.getAnAcademicDepartment);
router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.updateAnAcademicDepartment,
);

export const academicDepartmentRoute = router;
