import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicDepartmentService } from './academicDepartment_service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData = req.body;
  const result = await academicDepartmentService.createAcademicDepartmentIntoDB(
    academicDepartmentData,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic department is created successfully.',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentService.getAllAcademicDepartmentFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All academic department are retrieved successfully.',
    data: result,
  });
});

const getAnAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result =
    await academicDepartmentService.getAnAcademicDepartmentFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic department is retrieved successfully.',
    data: result,
  });
});

const updateAnAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result =
    await academicDepartmentService.updateAnAcademicDepartmentIntoDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic department is updated successfully.',
    data: result,
  });
});

export const academicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getAnAcademicDepartment,
  updateAnAcademicDepartment,
};
