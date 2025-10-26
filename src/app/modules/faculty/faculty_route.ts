//import express from 'express';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { facultyController } from './faculty_controller';
import { facultyValidation } from './faculty_validation';
//const router = express.Router();
const router = Router();

router.get('/', facultyController.getAllFaculties);
router.get('/:facultyId', facultyController.getAFaculty);
router.patch(
  '/:facultyId',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(facultyValidation.updateFacultyZodSchema),
  facultyController.updateAFaculty,
);
router.delete(
  '/:facultyId',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  facultyController.deleteAFaculty,
);

export const facultyRoute = router;
