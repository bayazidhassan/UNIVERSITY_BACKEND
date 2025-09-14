import status from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { updateDynamically } from '../../utils/updateDynamically';
import { User } from '../user/user_schema_model';
import { TFaculty } from './faculty_interface';
import { Faculty } from './faculty_schema_model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  /*
  const result = await Faculty.find();
  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Students are not found.');
  }
  return result;
  */

  const facultySearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
  ];

  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  );

  facultyQuery.search(facultySearchableFields).filter().sort();
  if (query?.page) {
    facultyQuery.paginate();
  }
  facultyQuery.fieldsLimiting();

  const result = await facultyQuery.modelQuery;

  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Faculties are not found.');
  }
  return result;
};

const getAFacultyFromDB = async (facultyId: string) => {
  const result = await Faculty.findOne({ id: facultyId }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found.');
  }
  return result;
};

const updateAFacultyIntoDb = async (
  facultyId: string,
  facultyData: Partial<TFaculty>,
) => {
  const { name, ...remainingFacultyData } = facultyData;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name) {
    updateDynamically('name', name, modifiedStudentData);
  }

  //static method
  const checkFaculty = await Faculty.isFacultyExists(facultyId);
  if (!checkFaculty) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found.');
  }

  //I have implemented query middleware/hook here to check before update
  const result = await Faculty.findOneAndUpdate(
    { id: facultyId },
    //facultyData,
    modifiedStudentData,
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found.');
  }
  return result;
};

const deleteAFacultyFromDB = async (facultyId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //transaction-1
    const deletedFaculty = await Faculty.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(status.NOT_FOUND, 'Failed to delete faculty.');
    }

    //transaction-2
    const deletedUser = await User.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(status.NOT_FOUND, 'Failed to delete user.');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const facultyService = {
  getAllFacultiesFromDB,
  getAFacultyFromDB,
  updateAFacultyIntoDb,
  deleteAFacultyFromDB,
};
