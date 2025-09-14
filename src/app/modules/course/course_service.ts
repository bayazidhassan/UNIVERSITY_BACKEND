import status from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TCourse, TCourseFaculties } from './course_interface';
import { Course, CourseFaculties } from './course_schema_model';

const createACourseIntoDB = async (courseData: TCourse) => {
  const result = await Course.create(courseData);
  if (!result) {
    throw new AppError(status.BAD_REQUEST, 'Failed to create course.');
  }
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  /*
  const result = await Course.find();
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Courses are not found.');
  }
  return result;
  */

  const courseSearchableFields = ['title', 'prefix', 'code'];

  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  );
  courseQuery.search(courseSearchableFields).filter().sort();
  if (query?.page) {
    courseQuery.paginate();
  }
  courseQuery.fieldsLimiting();
  const result = await courseQuery.modelQuery;
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'No course found.');
  }
  return result;
};

const getACourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Course is not found.');
  }
  return result;
};

const updateACourseIntoDB = async (
  id: string,
  courseData: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...remainingCourseData } = courseData;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //basic course info update (title, prefix, code, credits, isDeleted)
    const basicCourse = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!basicCourse) {
      throw new AppError(
        status.BAD_REQUEST,
        'Failed to update basic course info.',
      );
    }

    //to delete (isDeleted: true), to add (isDeleted: false)
    if (preRequisiteCourses?.length) {
      //filter out-> isDeleted: true
      const courseIdsToRemove = preRequisiteCourses
        .filter((p) => p.course && p.isDeleted)
        .map((p) => p.course);

      if (courseIdsToRemove.length) {
        const deletePrerequisiteCourse = await Course.findByIdAndUpdate(
          id,
          {
            $pull: {
              preRequisiteCourses: { course: { $in: courseIdsToRemove } },
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        );
        if (!deletePrerequisiteCourse) {
          throw new AppError(
            status.BAD_REQUEST,
            'Failed to delete prerequisite course.',
          );
        }
      }

      //filter out-> isDeleted: false
      const coursesToAdd = preRequisiteCourses.filter(
        (p) => p.course && !p.isDeleted,
      );

      if (coursesToAdd.length) {
        const addPrerequisiteCourse = await Course.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              preRequisiteCourses: { $each: coursesToAdd },
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        );
        if (!addPrerequisiteCourse) {
          throw new AppError(
            status.BAD_REQUEST,
            'Failed to add prerequisite course.',
          );
        }
      }
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    if (!result) {
      throw new AppError(status.NOT_FOUND, 'Course not found.');
    }
    return result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const deleteACourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Failed to delete course.');
  }
  return result;
};

const assignCourseFacultiesIntoDB = async (
  courseId: string,
  facultiesData: Partial<TCourseFaculties>,
) => {
  const result = await CourseFaculties.findByIdAndUpdate(
    courseId,
    {
      course: courseId,
      $addToSet: { faculties: { $each: facultiesData } },
    },
    {
      upsert: true,
      new: true,
      //runValidators: true,
    },
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Failed to add faculties.');
  }
  return result;
};

const deleteCourseFacultiesFromDB = async (
  courseId: string,
  facultiesData: Partial<TCourseFaculties>,
) => {
  const result = await CourseFaculties.findByIdAndUpdate(
    courseId,
    {
      $pull: { faculties: { $in: facultiesData } },
    },
    {
      new: true,
      //runValidators: true,
    },
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Failed to delete faculties.');
  }
  return result;
};

export const courseService = {
  createACourseIntoDB,
  getAllCoursesFromDB,
  getACourseFromDB,
  updateACourseIntoDB,
  deleteACourseFromDB,
  assignCourseFacultiesIntoDB,
  deleteCourseFacultiesFromDB,
};
