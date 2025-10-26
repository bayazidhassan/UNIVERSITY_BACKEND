import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { adminValidation } from '../admin/admin_validation';
import { facultyValidation } from '../faculty/faculty_validation';
import { studentValidation } from '../student/student_validation';
import { userControllers } from './user_controller';
import { USER_ROLE } from './user_interface';
import { userValidation } from './user_validation';

const router = express.Router();

router.post(
  '/create_student',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  upload.single('profile_image'), //postman-> form-data: field's key name (profile_image)
  (req: Request, res: Response, next: NextFunction) => {
    //to convert text data to json data
    req.body = JSON.parse(req.body.data); //postman-> form-data: field's key name (data)
    next();
  },
  validateRequest(studentValidation.createStudentZodSchema),
  userControllers.createStudent,
);
router.post(
  '/create_faculty',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  validateRequest(facultyValidation.createFacultyZodSchema),
  userControllers.createFaculty,
);

router.post(
  '/create_admin',
  auth(USER_ROLE.super_admin),
  validateRequest(adminValidation.createAdminZodSchema),
  userControllers.createAdmin,
);

router.get(
  '/getMe',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  userControllers.getMe,
);

router.patch(
  '/changeStatus/:id',
  validateRequest(userValidation.userStatusChangeZodSchema),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  userControllers.changeStatus,
);

export const userRoutes = router;
