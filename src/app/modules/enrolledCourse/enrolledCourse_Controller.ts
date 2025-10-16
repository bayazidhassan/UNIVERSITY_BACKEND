import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseService } from './enrolledCourse_Service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await enrolledCourseService.createEnrolledCourseIntoDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is enrolled successfully.',
    data: result,
  });
});

export const enrolledCourseController = {
  createEnrolledCourse,
};
