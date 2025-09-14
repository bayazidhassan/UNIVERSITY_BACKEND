import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { adminController } from './admin_controller';
import { adminValidation } from './admin_validation';
const router = express.Router();

router.get('/', adminController.getAllAdmins);
router.get('/:adminId', adminController.getAnAdmin);
router.patch(
  '/:adminId',
  validateRequest(adminValidation.updateAdminZodSchema),
  adminController.updateAnAdmin,
);
router.delete('/:adminId', adminController.deleteAnAdmin);

export const adminRoute = router;
