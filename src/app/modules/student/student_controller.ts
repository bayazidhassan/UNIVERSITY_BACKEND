import { RequestHandler } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { studentServices } from './student_service';

//use catchAsync function here
const getAllStudent = catchAsync(async (req, res) => {
  const query = req.query;
  //const result = await studentServices.getAllStudentFromDB();
  const result = await studentServices.getAllStudentFromDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student are retrieved successfully.',
    data: result,
  });
});

const getAStudent: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.studentId;
    const result = await studentServices.getAStudentFromDB(id);

    /*
    res.status(200).json({
      success: true,
      message: 'Student is retrieved successfully.',
      data: result,
    });
    */
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is retrieved successfully.',
      data: result,
    });
  } catch (err) {
    /*
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: (err as Error).message,
    });
    */
    //global error handler
    next(err);
  }
};

const updateAStudent: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.studentId;
    //const {student} = req.body;
    const studentData = req.body.student;

    /*
    //I have implemented this logic into the student route
    //zod validation
    const validateStudentData =
      await studentValidation.updateStudentZodSchema.parseAsync(studentData);
    */

    const result = await studentServices.updateAStudentIntoDB(
      id,
      //validateStudentData,
      studentData,
    );
    /*
    res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data: result,
    });
    */
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student updated successfully!',
      data: result,
    });
  } catch (err) {
    /*
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: (err as Error).message,
    });
    */
    //global error handler
    next(err);
  }
};

const deleteAStudent: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.studentId;
    const result = await studentServices.deleteAStudentFromDB(id);

    /*
    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully.',
      data: null,
    });
    */
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is deleted successfully.',
      data: result,
    });
  } catch (err) {
    /*
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: (err as Error).message,
    });
    */

    //global error handler
    next(err);
  }
};

export const studentController = {
  getAllStudent,
  getAStudent,
  deleteAStudent,
  updateAStudent,
};
