//import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express';
import status from 'http-status';
import { JwtDecoded } from '../../interface/jwt_tokeData_interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user_service';

//const createStudent = async (req: Request, res: Response, next: NextFunction) => {
const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body; //object destructuring with variable renaming (aliasing)
    const file = req.file as Express.Multer.File;

    const result = await userServices.createStudentIntoDB(
      file,
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

const getMe = catchAsync(async (req, res) => {
  const data = req.user as JwtDecoded;
  const result = await userServices.getMeFromDB(data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'I am retrieved successfully.',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userStatus = req.body.status;
  const result = await userServices.changeStatusIntoDB(id, userStatus);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User status is changed successfully.',
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
