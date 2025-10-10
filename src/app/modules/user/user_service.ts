import status from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester_schema_model';
import { TAdmin } from '../admin/admin_interface';
import { Admin } from '../admin/admin_schema_model';
import { TFaculty } from '../faculty/faculty_interface';
import { Faculty } from '../faculty/faculty_schema_model';
import { TStudent } from '../student/student_interface';
import { Student } from '../student/student_schema_model';
import { TUser } from './user_interface';
import { User } from './user_schema_model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user_utils';
import userZodSchema from './user_validation';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  /*
  //This logic is no longer needed here, because I have implemented transaction operation below to create an user and a student at a time
  //check student is already exist or not
  const isExist = await Student.findOne({ email: studentData.email });
  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      `A student is already exist with this email: ${studentData.email}`,
    );
  }
  */

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    studentData.admissionSemester,
  );
  if (!admissionSemester) {
    throw new Error('Admission semester is not found');
  }

  const userData: Partial<TUser> = {
    id: await generateStudentId(admissionSemester), //generate unique id
    email: studentData.email,
    password: password || (config.default_password as string), //if password is not given , use default password
    //needPasswordChange: default value
    role: 'student',
    //status: default value
    //isDeleted: default value
  };

  //zod validation
  const validateUserData = await userZodSchema.parseAsync(userData);

  //implement transaction here
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //create an user (transaction-1)
    //const userResult = await User.create(validateUserData); //Note: The create() function fires save() hooks.
    //But note: during create(), select: false doesn’t automatically hide password in the returned doc — you’ll still see it unless you convert the doc and strip it.
    const userResult = await User.create([validateUserData], { session }); //Note: The create() function fires save() hooks.
    /*
    if (!userResult) {
      throw new Error('Failed to create user.');
    }
    */
    if (!userResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create user.');
    }
    /*
    //to do not send password field in the returned doc
    const newUserResult: Partial<TUser> = userResult[0].toObject();
    delete newUserResult.password;
    */

    //studentData.id = userResult.id;
    //studentData.user = userResult._id;
    studentData.id = userResult[0].id;
    studentData.user = userResult[0]._id;

    //create a student (transaction-2)
    //const studentResult = await Student.create(studentData); //Note: The create() function fires save() hooks.
    //But note: during create(), select: false doesn’t automatically hide password in the returned doc — you’ll still see it unless you convert the doc and strip it.
    const studentResult = await Student.create([studentData], { session }); //Note: The create() function fires save() hooks.
    /*
    if (!studentResult) {
      throw new Error('Failed to create student.');
    }
    */
    if (!studentResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create student.');
    }

    //if transaction successful
    await session.commitTransaction();
    await session.endSession();

    //return studentResult;
    return studentResult[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    //if transaction failed
    await session.abortTransaction();
    await session.endSession();
    //throw new AppError(status.BAD_REQUEST, 'Failed to create a student.');
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (password: string, facultyData: TFaculty) => {
  const user: Partial<TUser> = {
    id: await generateFacultyId(),
    email: facultyData.email,
    password: password || (config.default_password as string),
    //needPasswordChange: default value,
    role: 'faculty',
    //status: default value,
    //isDeleted: default value,
  };

  const validateUser = await userZodSchema.parseAsync(user);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //create an user(Transaction-1)
    const userResult = await User.create([validateUser], { session });
    if (!userResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create user.');
    }

    //create a faculty(Transaction-2)
    facultyData.id = userResult[0].id;
    facultyData.user = userResult[0]._id;

    const facultyResult = await Faculty.create([facultyData], { session });
    if (!facultyResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create faculty.');
    }

    await session.commitTransaction();
    await session.endSession();

    //return facultyResult;
    return facultyResult[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    //throw new AppError(status.BAD_REQUEST, 'Failed to create a student.');
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, adminData: TAdmin) => {
  const user: Partial<TUser> = {
    id: await generateAdminId(),
    email: adminData.email,
    password: password || (config.default_password as string),
    //needPasswordChange: default value,
    role: 'admin',
    //status: default value,
    //isDeleted: default value,
  };

  const validateUser = await userZodSchema.parseAsync(user);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //create an user(Transaction-1)
    const userResult = await User.create([validateUser], { session });
    if (!userResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create user.');
    }

    //create a admin(Transaction-2)
    adminData.id = userResult[0].id;
    adminData.user = userResult[0]._id;

    const adminResult = await Admin.create([adminData], { session });
    if (!adminResult.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    //return adminResult;
    return adminResult[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
