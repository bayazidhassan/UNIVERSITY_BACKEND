import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { authController } from './auth_controller';
import { authValidation } from './auth_validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationZodSchema),
  authController.loginUser,
);

router.post(
  '/change_password',
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  validateRequest(authValidation.changePasswordValidationZodSchema),
  authController.changePassword,
);

router.post(
  '/refresh_token',
  validateRequest(authValidation.refreshTokenValidationZodSchema),
  authController.refreshToken,
);

router.post(
  '/forgot_password',
  validateRequest(authValidation.forgotPasswordValidationSchema),
  authController.forgotPassword,
);

router.post(
  '/reset_password',
  validateRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPassword,
);

export const authRoute = router;
