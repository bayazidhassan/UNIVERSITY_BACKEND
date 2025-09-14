import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationController } from './semesterRegistration_controller';
import { semesterRegistrationValidation } from './semesterRegistration_validation';
const router = express.Router();

router.post(
  '/createSemesterRegistration',
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
  validateRequest(
    semesterRegistrationValidation.updateSemesterRegistrationZodSchema,
  ),
  semesterRegistrationController.updateASemesterRegistration,
);
router.delete(
  '/:id',
  semesterRegistrationController.deleteASemesterRegistration,
);

export const semesterRegistrationRoute = router;
