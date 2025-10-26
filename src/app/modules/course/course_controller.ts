import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseService } from './course_service';

const createACourse = catchAsync(async (req, res) => {
  const courseData = req.body.course;
  const result = await courseService.createACourseIntoDB(courseData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is created successfully.',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await courseService.getAllCoursesFromDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Courses are retrieved successfully.',
    data: result,
  });
});

const getACourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  //const id = req.params.id;
  const result = await courseService.getACourseFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is retrieved successfully.',
    data: result,
  });
});

const updateACourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  //const id = req.params.id;
  const courseData = req.body.course;
  const result = await courseService.updateACourseIntoDB(id, courseData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is updated successfully.',
    data: result,
  });
});

const deleteACourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  //const id = req.params.id;
  const result = await courseService.deleteACourseFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is deleted successfully.',
    data: result,
  });
});

const assignCourseFaculties = catchAsync(async (req, res) => {
  //const courseId = req.params.courseId;
  const { courseId } = req.params;
  //const faculties = req.body.faculties;
  const { faculties } = req.body;
  const result = await courseService.assignCourseFacultiesIntoDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are assigned successfully.',
    data: result,
  });
});

const getCourseFaculties = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const result = await courseService.getCourseFacultiesFromDB(courseId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are retrieved successfully.',
    data: result,
  });
});

const removeCourseFaculties = catchAsync(async (req, res) => {
  //const courseId = req.params.courseId;
  const { courseId } = req.params;
  //const faculties = req.body.faculties;
  const { faculties } = req.body;
  const result = await courseService.removeCourseFacultiesFromDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are removed successfully.',
    data: result,
  });
});

export const courseController = {
  createACourse,
  getAllCourses,
  getACourse,
  updateACourse,
  deleteACourse,
  assignCourseFaculties,
  getCourseFaculties,
  removeCourseFaculties,
};
