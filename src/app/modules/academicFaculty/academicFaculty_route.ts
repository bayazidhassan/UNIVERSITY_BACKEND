import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { academicFacultyController } from './academicFaculty_controller';
import { academicFacultyValidation } from './academicFaculty_validation';

const router = express.Router();
router.post(
  '/createAcademicFaculty',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
);
router.get('/', academicFacultyController.getAllAcademicFaculties);
router.get('/:id', academicFacultyController.getAnAcademicFaculty);
router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicFacultyValidation),
  academicFacultyController.updateAnAcademicFaculty,
);

export const academicFacultyRoute = router;
