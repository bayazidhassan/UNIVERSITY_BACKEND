import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyService } from './faculty_service';

const getAllFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  //const result = await facultyService.getAllFacultiesFromDB();
  const result = await facultyService.getAllFacultiesFromDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All Faculties are retrieved successfully.',
    data: result,
  });
});

const getAFaculty = catchAsync(async (req, res) => {
  const facultyId = req.params.facultyId;
  const result = await facultyService.getAFacultyFromDB(facultyId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are retrieved successfully.',
    data: result,
  });
});

const updateAFaculty = catchAsync(async (req, res) => {
  const facultyId = req.params.facultyId;
  const facultyData = req.body.faculty;
  const result = await facultyService.updateAFacultyIntoDb(
    facultyId,
    facultyData,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is updated successfully.',
    data: result,
  });
});

const deleteAFaculty = catchAsync(async (req, res) => {
  const facultyId = req.params.facultyId;
  const result = await facultyService.deleteAFacultyFromDB(facultyId);
  sendResponse(res, {
    statusCode: status.NOT_FOUND,
    success: true,
    message: 'Faculty is deleted successfully.',
    data: result,
  });
});

export const facultyController = {
  getAllFaculties,
  getAFaculty,
  updateAFaculty,
  deleteAFaculty,
};
