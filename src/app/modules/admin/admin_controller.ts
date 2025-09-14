import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin_service';

const getAllAdmins = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await adminService.getAllAdminsFromDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admins are retrieved successfully.',
    data: result,
  });
});

const getAnAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.adminId;
  const result = await adminService.getAnAdminFromDB(adminId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is retrieved successfully.',
    data: result,
  });
});

const updateAnAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.adminId;
  const adminData = req.body.admin;
  const result = await adminService.updateAnAdminIntoDB(adminId, adminData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is updated successfully.',
    data: result,
  });
});

const deleteAnAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.adminId;
  const result = await adminService.deleteAnAdminFromDB(adminId);
  sendResponse(res, {
    statusCode: status.NOT_FOUND,
    success: true,
    message: 'Admin is deleted successfully.',
    data: result,
  });
});

export const adminController = {
  getAllAdmins,
  getAnAdmin,
  updateAnAdmin,
  deleteAnAdmin,
};
