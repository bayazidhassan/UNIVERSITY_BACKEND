import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicFacultyService } from './academicFaculty_service';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyData = req.body;
  const result =
    await academicFacultyService.createAcademicFacultyIntoDB(
      academicFacultyData,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic faculty is created successfully.',
    data: result,
  });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await academicFacultyService.getAllAcademicFacultyFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All academic faculties are retrieved successfully.',
    data: result,
  });
});

const getAnAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicFacultyService.getAnAcademicFacultyFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic faculty is retrieved successfully.',
    data: result,
  });
});

const updateAnAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await academicFacultyService.updateAnAcademicFacultyIntoDB(
    id,
    data,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic faculty is updated successfully.',
    data: result,
  });
});

export const academicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getAnAcademicFaculty,
  updateAnAcademicFaculty,
};
