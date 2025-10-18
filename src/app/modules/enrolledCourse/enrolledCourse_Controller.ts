import status from 'http-status';
import { JwtDecoded } from '../../interface/jwt_tokeData_interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseService } from './enrolledCourse_Service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user?.data.userId as string;
  const offeredCourse = req.body.offeredCourse;
  const result = await enrolledCourseService.createEnrolledCourseIntoDB(
    userId,
    offeredCourse,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is enrolled successfully.',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const user = req.user as JwtDecoded;
  const result = await enrolledCourseService.updateEnrolledCourseMarksIntoDB(
    user,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is updated successfully.',
    data: result,
  });
});

export const enrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
