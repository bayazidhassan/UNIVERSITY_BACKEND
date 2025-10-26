import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user_interface';
import { adminController } from './admin_controller';
import { adminValidation } from './admin_validation';
const router = express.Router();

router.get('/', adminController.getAllAdmins);
router.get('/:adminId', adminController.getAnAdmin);
router.patch(
  '/:adminId',
  auth(USER_ROLE.super_admin),
  validateRequest(adminValidation.updateAdminZodSchema),
  adminController.updateAnAdmin,
);
router.delete(
  '/:adminId',
  auth(USER_ROLE.super_admin),
  adminController.deleteAnAdmin,
);

export const adminRoute = router;
