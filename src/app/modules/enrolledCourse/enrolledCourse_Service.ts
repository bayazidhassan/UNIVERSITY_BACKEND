import status from 'http-status';
import AppError from '../../errors/AppError';
import { JwtDecoded } from '../../interface/jwt_tokeData_interface';
import { Course } from '../course/course_schema_model';
import { Faculty } from '../faculty/faculty_schema_model';
import { OfferedCourse } from '../offeredCourse/offeredCourse_schema_model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration_schema_model';
import { Student } from '../student/student_schema_model';
import { TEnrolledCourse } from './enrolledCourse_Interface';
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

  //check the available seats of this offered course->max capacity
  if (isOfferedCourseExists.maxCapacity === 0) {
    throw new AppError(status.BAD_REQUEST, 'All seats are booked.');
  }

  //check the student is already enrolled this offered course
  const student = await Student.findOne({ id: userId }, { _id: 1 }); //Field filtering or projection → selecting only specific fields to return in a MongoDB query.
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

  //check a student's total enrolled courses credits+new offered course credits > maxCredit for a specific semester registration
  /*
  const total_enrolledCourse2 = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'alreadyEnrolledCourses',
      },
    },
    {
      $unwind: '$alreadyEnrolledCourses',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$alreadyEnrolledCourses.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);
  const total_credits2 = total_enrolledCourse2.length
    ? total_enrolledCourse2[0].totalEnrolledCredits
    : 0;
  const semesterRegistration2 = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
    {
      _id: 0,
      maxCredit: 1,
    },
  );
  const maxCredit2 = semesterRegistration2?.maxCredit ?? 0; //nullish coalescing operator
  const course = await Course.findById(isOfferedCourseExists.course, {
    _id: 0,
    credits: 1,
  });
  if (total_credits2 + course?.credits > maxCredit2) {
    throw new AppError(status.BAD_REQUEST, 'Credit limit exceeded.');
  }
  */
  const total_enrolledCourse = (
    await EnrolledCourse.find(
      {
        student: student?._id,
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
      },
      { _id: 0, course: 1 },
    )
  ).map((doc) => ({ course: doc.course })); //This creates a plain JavaScript array (not Mongoose documents) containing only the course field.
  //.lean()) as { course: Types.ObjectId }[]; //you can also use this
  /*
  Mongoose find() returns Mongoose documents, which have lots of extra properties and methods (like .save(), .populate(), etc.).
  Sometimes, you just want plain JS objects for clean data manipulation — like when you’re about to push, merge, or validate them manually.

  So .map((doc) => ({ course: doc.course })) helps you:
  Extract only the field(s) you care about
  Avoid Mongoose document overhead
  Make the array easy to work with for operations like push, filter, includes, etc.
  */
  total_enrolledCourse.push({ course: isOfferedCourseExists.course });
  let total_credits = 0;
  for (const el of total_enrolledCourse) {
    //here we can not use forEach, because forEach does not wait for await.
    const courseData = await Course.findById(el.course, { _id: 0, credits: 1 });
    total_credits += courseData?.credits ?? 0; //The operator ?? is called the nullish coalescing operator -> “If the value on the left is null or undefined, then use the value on the right.”
  }
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
    {
      _id: 0,
      maxCredit: 1,
    },
  );
  const maxCredit = semesterRegistration?.maxCredit ?? 0; //nullish coalescing operator
  if (total_credits > maxCredit) {
    throw new AppError(status.BAD_REQUEST, 'Credit limit exceeded.');
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

const updateEnrolledCourseMarksIntoDB = async (
  user: JwtDecoded,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isEnrolledCourseExists = await EnrolledCourse.findOne({
    //semesterRegistration: semesterRegistration,
    //offeredCourse: offeredCourse,
    //student: student,
    semesterRegistration,
    offeredCourse,
    student,
  });
  if (!isEnrolledCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Enrolled course not found.');
  }

  //check valid faculty to update marks
  if (user.data.role === 'faculty') {
    const facultyId = user.data.userId;

    const faculty = await Faculty.findById(isEnrolledCourseExists.faculty, {
      _id: 0,
      id: 1,
    });
    if (faculty && facultyId !== faculty.id) {
      throw new AppError(
        status.UNAUTHORIZED,
        'You are not valid faculty to update result.',
      );
    }
  }

  //update dynamically
  const modifiedData: Record<string, unknown> = {};

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isEnrolledCourseExists._id,
    modifiedData,
    { new: true },
  );
  return result;
};

export const enrolledCourseService = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
