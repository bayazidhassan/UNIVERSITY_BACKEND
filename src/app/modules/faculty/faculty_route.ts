//import express from 'express';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyController } from './faculty_controller';
import { facultyValidation } from './faculty_validation';
//const router = express.Router();
const router = Router();

router.get('/', facultyController.getAllFaculties);
router.get('/:facultyId', facultyController.getAFaculty);
router.patch(
  '/:facultyId',
  validateRequest(facultyValidation.updateFacultyZodSchema),
  facultyController.updateAFaculty,
);
router.delete('/:facultyId', facultyController.deleteAFaculty);

export const facultyRoute = router;
