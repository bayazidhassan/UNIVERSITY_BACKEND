import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationService } from './semesterRegistration_service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester registration is created successfully.',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationService.getAllSemesterRegistrationsFromDB(
      req.query,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester registrations are retrieved successfully.',
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result =
    await semesterRegistrationService.getSingleSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester registration is retrieved successfully.',
    data: result,
  });
});

const updateASemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const semesterRegistrationData = req.body;

  const result =
    await semesterRegistrationService.updateASemesterRegistrationIntoDB(
      id,
      semesterRegistrationData,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester registration is updated successfully.',
    data: result,
  });
});

const deleteASemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result =
    await semesterRegistrationService.deleteASemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Semester registration is deleted successfully.',
    data: result,
  });
});

export const semesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateASemesterRegistration,
  deleteASemesterRegistration,
};
