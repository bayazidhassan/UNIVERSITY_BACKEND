import status from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester_schema_model';
import { OfferedCourse } from '../offeredCourse/offeredCourse_schema_model';
import { TSemesterRegistration } from './semesterRegistration_interface';
import { SemesterRegistration } from './semesterRegistration_schema_model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //check academic semester is found or not
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(status.NOT_FOUND, 'Academic semester is not found.');
  }

  //check semester is already registered or not
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester: academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(status.CONFLICT, 'This semester is already registered.');
  }

  //check any registered semester is already 'UPCOMING' or 'ONGOING'
  //const isUpcomingOngoing = await SemesterRegistration.findOne({ // Use findOne() if you need the actual document’s data.
  //Use exists() if you only care about whether such a document exists. It only returns a truthy object (with _id) if found, or null otherwise.
  const isUpcomingOngoing = await SemesterRegistration.exists({
    status: { $in: ['UPCOMING', 'ONGOING'] }, //shorter, cleaner, and preferred when checking multiple possible values of the same field.
    //$or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }], //more flexible when conditions involve different fields (e.g., status = 'UPCOMING' OR year = 2025).
  });
  if (isUpcomingOngoing) {
    throw new AppError(
      status.BAD_REQUEST,
      'A semester is already UPCOMING or ONGOING.',
    );
  }

  const result = await SemesterRegistration.create(payload);
  if (!result) {
    throw new AppError(
      status.BAD_REQUEST,
      'Failed to create semester registration.',
    );
  }
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationSearchableFields = [
    'status',
    'mixCredit',
    'maxCredit',
  ];
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  );
  semesterRegistrationQuery
    .search(semesterRegistrationSearchableFields)
    .filter()
    .sort();
  if (query?.page) {
    semesterRegistrationQuery.paginate();
  }
  semesterRegistrationQuery.fieldsLimiting();

  const result = await semesterRegistrationQuery.modelQuery;

  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(
      status.NOT_FOUND,
      'Semester registrations are not found.',
    );
  }
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Semester registration is not found.');
  }
  return result;
};

const updateASemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check the semester is exists or not
  const isExists = await SemesterRegistration.findById(id);
  if (!isExists) {
    throw new AppError(status.BAD_REQUEST, 'This semester is not existed!');
  }

  //check the semester is already ended or not
  if (isExists?.status === 'ENDED') {
    throw new AppError(status.BAD_REQUEST, 'This semester is already ended!');
  }

  //validation for: UPCOMING --> ONGOING --> ENDED
  if (isExists?.status === 'UPCOMING' && payload?.status === 'ENDED') {
    throw new AppError(
      status.BAD_REQUEST,
      'You can not set status to ENDED when it is already set to UPCOMING!',
    );
  }
  if (isExists?.status === 'ONGOING' && payload?.status === 'UPCOMING') {
    throw new AppError(
      status.BAD_REQUEST,
      'You can not set status to UPCOMING when it is already set to ONGOING!',
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      'Failed to update semester registration.',
    );
  }
  return result;
};

const deleteASemesterRegistrationFromDB = async (id: string) => {
  const isOfferedCourseExists = await SemesterRegistration.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Semester registration is not found.');
  }

  if (isOfferedCourseExists?.status !== 'UPCOMING') {
    throw new AppError(
      status.NOT_FOUND,
      'You can not delete any ONGOING or ENDED semester.',
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //transaction-1
    const deletedOfferedCourses = await OfferedCourse.deleteMany({
      semesterRegistration: id,
    });
    /*
    When you use deleteMany() in Mongoose (or the MongoDB native driver), the result is an object containing
    metadata(acknowledged, deletedCount) about the operation, not the deleted documents themselves.
    */
    if (!deletedOfferedCourses.deletedCount) {
      throw new AppError(
        status.BAD_REQUEST,
        'Failed to delete offered courses.',
      );
    }

    //transaction-2
    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id);

    if (!deleteASemesterRegistrationFromDB) {
      throw new AppError(
        status.BAD_REQUEST,
        'Failed to delete semester registration.',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedSemesterRegistration;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const semesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateASemesterRegistrationIntoDB,
  deleteASemesterRegistrationFromDB,
};
