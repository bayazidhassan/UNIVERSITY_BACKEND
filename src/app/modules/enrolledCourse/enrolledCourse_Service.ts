import status from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse_schema_model';
import { Student } from '../student/student_schema_model';
import { EnrolledCourse } from './enrolledCourse_Model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  offeredCourse: string,
) => {
  //check the offered course is exists or not
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Offered is not existed.');
  }

  //check offered course max capacity
  if (isOfferedCourseExists.maxCapacity === 0) {
    throw new AppError(status.BAD_REQUEST, 'All seats are booked.');
  }

  //check the student is already enrolled this offered course
  const student = await Student.findOne({ id: userId });
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    //offeredCourse: offeredCourse,
    offeredCourse, //because key and value name are same
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      status.CONFLICT,
      'You have already enrolled this course.',
    );
  }

  //create enrolled course
  const data = {
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    academicSemester: isOfferedCourseExists.academicSemester,
    academicFaculty: isOfferedCourseExists.academicFaculty,
    academicDepartment: isOfferedCourseExists.academicDepartment,
    offeredCourse: offeredCourse,
    course: isOfferedCourseExists.course,
    student: student?._id,
    faculty: isOfferedCourseExists.faculty,
    isEnrolled: true,
    /*
    //by default all are 0
    courseMarks: {
      classTest1: 0,
      midTerm: 0,
      classTest2: 0,
      finalTerm: 0,
    },
    */
    //grade: 'NA', //by default it is NA
    //gradePoints: 0, //by default it is 0
    //isCompleted: false, //by default it is false
  };
  const result = await EnrolledCourse.create(data);
  if (!result) {
    throw new AppError(status.BAD_REQUEST, 'Failed to enroll this course');
  }

  //decrease max capacity
  await OfferedCourse.findByIdAndUpdate(offeredCourse, {
    maxCapacity: isOfferedCourseExists.maxCapacity - 1,
  });

  return result;
};
export const enrolledCourseService = {
  createEnrolledCourseIntoDB,
};
