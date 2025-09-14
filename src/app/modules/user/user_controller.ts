//import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user_service';

//const createStudent = async (req: Request, res: Response, next: NextFunction) => {
const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body;

    const result = await userServices.createStudentIntoDB(
      password,
      studentData,
    );
    /*
    res.status(200).json({
      success: true,
      message: 'Student is created successfully.',
      data: result,
    });
    */
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is created successfully.',
      data: result,
    });
  } catch (err) {
    /*
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: (err as Error).message,
    });
    */
    //global error handler
    next(err);
  }
};

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await userServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is created successfully.',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await userServices.createAdminIntoDB(password, adminData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is created successfully.',
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
