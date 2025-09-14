import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseService } from './offeredCourse_service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseService.createOfferedCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Offered course is created successfully.',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCourseService.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Offered courses are retrieved successfully.',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseService.getSingleOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Offered course is retrieved successfully.',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const offeredCourseData = req.body;
  const result = await offeredCourseService.updateOfferedCourseIntoDB(
    id,
    offeredCourseData,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Offered course is updated successfully.',
    data: result,
  });
});

const deleteAOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseService.deleteAOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Offered course is deleted successfully.',
    data: result,
  });
});

export const offeredCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteAOfferedCourse,
};
