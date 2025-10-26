import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationController } from './semesterRegistration_controller';
import { semesterRegistrationValidation } from './semesterRegistration_validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user_interface';
const router = express.Router();

router.post(
  '/createSemesterRegistration',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidation.createSemesterRegistrationZodSchema,
  ),
  semesterRegistrationController.createSemesterRegistration,
);
router.get('/', semesterRegistrationController.getAllSemesterRegistrations);
router.get(
  '/:id',
  semesterRegistrationController.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidation.updateSemesterRegistrationZodSchema,
  ),
  semesterRegistrationController.updateASemesterRegistration,
);
router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  semesterRegistrationController.deleteASemesterRegistration,
);

export const semesterRegistrationRoute = router;
