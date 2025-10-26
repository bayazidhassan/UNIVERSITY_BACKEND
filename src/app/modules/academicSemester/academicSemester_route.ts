import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterController } from './academicSemester_controller';
import { academicSemesterValidation } from './academicSemester_validation';
import { USER_ROLE } from '../user/user_interface';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create_academicSemester',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicSemesterValidation.createAcademicSemesterZodSchema),
  academicSemesterController.createAcademicSemester,
);
router.get('/', academicSemesterController.getAllAcademicSemester);
router.get('/:id', academicSemesterController.getAnAcademicSemester);

router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(academicSemesterValidation.updateAcademicSemesterZodSchema),
  academicSemesterController.updateAnAcademicSemester,
);

export const academicSemesterRoute = router;
