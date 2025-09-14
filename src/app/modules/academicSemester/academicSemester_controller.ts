import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterService } from './academicSemester_service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterService.createAcademicSemesterIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic semester is created successfully.',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterService.getAllAcademicSemesterFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully.',
    data: result,
  });
});

const getAnAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicSemesterService.getAnAcademicSemesterFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic semester is retrieved successfully.',
    data: result,
  });
});

const updateAnAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const academicSemesterData = req.body;

  const result = await academicSemesterService.updateAnAcademicSemesterIntoDB(
    id,
    academicSemesterData,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic semester is updated successfully.',
    data: result,
  });
});

export const academicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getAnAcademicSemester,
  updateAnAcademicSemester,
};
