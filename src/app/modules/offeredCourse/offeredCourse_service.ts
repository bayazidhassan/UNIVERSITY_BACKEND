import status from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment_schema_model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty_schema_model';
import { Course } from '../course/course_schema_model';
import { EnrolledCourse } from '../enrolledCourse/enrolledCourse_Model';
import { Faculty } from '../faculty/faculty_schema_model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration_schema_model';
import { Student } from '../student/student_schema_model';
import { TOfferedCourse, TSchedule } from './offeredCourse_Interface';
import { OfferedCourse } from './offeredCourse_schema_model';
import { checkTimeConflictForFaculty } from './offeredCourse_utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  //check time validation
  //const start = new Date(`1970-01-01T${payload.startTime}:00`);
  //const end = new Date(`1970-01-01T${payload.endTime}:00`);
  //if (start >= end) {

  //Lexicographical comparison
  if (startTime >= endTime) {
    throw new AppError(
      status.BAD_REQUEST,
      'The start time will never be greater than or equal to the end time.',
    );
  }

  //check semester registration id is existed or not
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(status.NOT_FOUND, 'Semester registration is not found.');
  }

  //check academic faculty id is existed or not
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Academic faculty is not found.');
  }

  //check academic department id is existed or not
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(status.NOT_FOUND, 'Academic department is not found.');
  }

  //check course id is existed or not
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Course is not found.');
  }

  //check faculty id is existed or not
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found.');
  }

  //check the academic department is belong to that academic faculty or not
  if (!isAcademicDepartmentExists.academicFaculty.equals(academicFaculty)) {
    throw new AppError(
      status.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} does not belong to the ${isAcademicFacultyExists.name}.`,
    );
  }

  //check if the same offered course in the same section in the same registration semester
  const checkSameCourseSectionSemester = await OfferedCourse.findOne({
    //es6 style
    semesterRegistration,
    course,
    section,
  });
  if (checkSameCourseSectionSemester) {
    throw new AppError(
      status.BAD_REQUEST,
      'This course is already offered in the same section and the same registration semester.',
    );
  }

  //resolve time conflict for a faculty
  const assignedSchedules = await OfferedCourse.find(
    //only filter for matching days
    { semesterRegistration, faculty, days: { $in: days } }, //es6 style
    { days: 1, startTime: 1, endTime: 1, _id: 0 },
  );
  const newSchedule: TSchedule = {
    days,
    startTime,
    endTime,
  };
  if (checkTimeConflictForFaculty(assignedSchedules, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      'This faculty is not available at this time. Choose another time or day.',
    );
  }

  payload.academicSemester = isSemesterRegistrationExists.academicSemester;
  const result = await OfferedCourse.create(payload);
  if (!result) {
    throw new AppError(status.BAD_REQUEST, 'Failed to create offered course.');
  }
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseSearchableFields = ['days', 'startTime', 'endTime'];
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find()
      .populate('semesterRegistration')
      .populate('academicSemester')
      .populate('academicFaculty')
      .populate('academicDepartment')
      .populate('course')
      .populate('faculty'),
    query,
  );
  offeredCourseQuery.search(offeredCourseSearchableFields).filter().sort();
  if (query?.page) {
    offeredCourseQuery.paginate();
  }
  offeredCourseQuery.fieldsLimiting();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Offered courses are not found.');
  }
  //return result;
  return {
    result,
    meta,
  };
};

const getMyOfferedCoursesFromDB = async (userId: string) => {
  const isStudentExists = await Student.findOne({ id: userId });
  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, 'Student is not found.');
  }

  //find current ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );
  if (!currentOngoingRegistrationSemester) {
    throw new AppError(status.NOT_FOUND, 'There is no ongoing semester.');
  }

  //Technique:1 - showed by PH video
  /*
  const result = await OfferedCourse.aggregate([
    //stage:1 - Get all courses offered by my department in the current ongoing semester.
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester._id,
        academicFaculty: isStudentExists.academicFaculty,
        academicDepartment: isStudentExists.academicDepartment,
      },
    },
    //stage:2 - Use $lookup to join the 'courses' collection (acts like populate)
    {
      $lookup: {
        from: 'courses', //collection name (lowercase plural)
        localField: 'course', // field in OfferedCourse
        foreignField: '_id', //field in Course
        as: 'course', //output array name
      },
    },
    //stage:3 - Break the 'course' array into separate documents using $unwind.
    {
      $unwind: '$course', //as: 'course'
    },
    //stage:4 - Find all enrolled course documents for this student in the current ongoing semester (only where isEnrolled is true)
    {
      $lookup: {
        from: 'enrolledcourses', //collection name (lowercase plural)
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      currentOngoingRegistrationSemester._id,
                    ],
                  },
                  {
                    $eq: ['$student', isStudentExists._id],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses', //output array name
      },
    },
    //stage:5 - Find all completed courses for this student
    {
      $lookup: {
        from: 'enrolledcourses', //collection name (lowercase plural)
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', isStudentExists._id],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses', //output array name
      },
    },
    //stage:6 - get completed courses IDs
    {
      $addFields: {
        completedCourseIDs: {
          $map: {
            input: '$completedCourses', // as: 'completedCourses'
            as: 'completed',
            in: '$$completed.course', //as: 'completed'
          },
        },
      },
    },
    //stage:7 - Compare offered courses with the student's enrolledCourses and flag those already enrolled (isAlreadyEnrolled = true)
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            {
              $eq: ['$course.preRequisiteCourses', []],
            },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIDs',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses', //as: 'enrolledCourses'
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    //stage:7 - Return only those offered courses that the student has not enrolled in yet
    //and these courses have no prerequisite course/courses or they are already completed(isCompleted:true)
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ]);

  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Offered courses are not found.');
  }

  return result;
  */

  //Technique:2
  //Disadvantage: Slightly less efficient if you have huge datasets (because filtering happens in Node.js)
  //Advantage: cleaner & more readable (TypeScript-friendly)
  /*
  //1. Get all offered courses for the student's department in the current ongoing semester
  const offeredCourses = await OfferedCourse.find({
    semesterRegistration: currentOngoingRegistrationSemester._id,
    academicFaculty: isStudentExists.academicFaculty,
    academicDepartment: isStudentExists.academicDepartment,
  }).populate('course');

  //2. Get IDs of courses the student is currently enrolled in
  const enrolled = await EnrolledCourse.find(
    {
      student: isStudentExists._id,
      semesterRegistration: currentOngoingRegistrationSemester._id,
      isEnrolled: true,
    },
    { _id: 0, course: 1 },
  );
  const enrolledCourseIds = enrolled.map((c) => c.course.toString());

  //3. Get IDs of courses the student has already completed
  const completed = await EnrolledCourse.find(
    {
      student: isStudentExists._id,
      isCompleted: true,
    },
    { _id: 0, course: 1 },
  );
  const completedCourseIds = completed.map((c) => c.course.toString());

  //4. Filter out courses that are already enrolled AND check prerequisite completion
  const availableCourses = offeredCourses.filter((offeredCourse) => {
    const courseId = offeredCourse.course._id.toString();
    const course = offeredCourse.course as unknown as TCourse;
    const preReqs = course.preRequisiteCourses || [];

    //Condition 1: Student is NOT already enrolled
    const notEnrolled = !enrolledCourseIds.includes(courseId);

    //Condition 2: Either no prerequisites OR all prerequisites are completed
    const prerequisitesFulfilled =
      preReqs.length === 0 ||
      preReqs.every((pr) => completedCourseIds.includes(pr.course.toString()));

    return notEnrolled && prerequisitesFulfilled;
  });

  if (!availableCourses.length) {
    throw new AppError(status.NOT_FOUND, 'Offered courses are not found.');
  }
  return availableCourses;
  */

  //Technique:3 - Advantage: faster & more efficient (database does the heavy work)
  //Step 1 — Get all enrolled course IDs for this student in the current semester
  const enrolledCourses = await EnrolledCourse.find({
    student: isStudentExists._id,
    semesterRegistration: currentOngoingRegistrationSemester._id,
    isEnrolled: true,
  }).select('course');
  const enrolledCourseIds = enrolledCourses.map((e) => e.course);

  //Step 2 — Get all completed course IDs for this student
  const completedCourses = await EnrolledCourse.find({
    student: isStudentExists._id,
    isCompleted: true,
  }).select('course');
  const completedCourseIds = completedCourses.map((c) => c.course);

  //Step 3 — Find offered courses where the student is eligible to enroll
  const result = await OfferedCourse.aggregate([
    //stage:1 - Get all courses offered by the student's department in the current ongoing semester
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester._id,
        academicFaculty: isStudentExists.academicFaculty,
        academicDepartment: isStudentExists.academicDepartment,
        course: { $nin: enrolledCourseIds }, //exclude already enrolled courses
      },
    },
    //stage:2 - Populate course details from the 'courses' collection
    {
      $lookup: {
        from: 'courses', //collection name (lowercase plural)
        localField: 'course', // field in OfferedCourse
        foreignField: '_id', //field in Course
        as: 'course', //output array name
      },
    },
    //Break the 'course' array into separate documents using $unwind.
    { $unwind: '$course' }, //as: 'course'
    //stage:3 - Check whether prerequisite course/courses are completed
    {
      $addFields: {
        isPreRequisitesFulfilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] }, //no prerequisites
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course', //required courses
                completedCourseIds, //completed courses
              ],
            },
          ],
        },
      },
    },
    //stage:4 - Keep only courses whose prerequisites are fulfilled
    {
      $match: { isPreRequisitesFulfilled: true },
    },
  ]);

  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Offered courses are not found.');
  }
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id)
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('course')
    .populate('faculty');
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Offered course is not found.');
  }
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  //check offered course id existed or not
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Offered course is not found.');
  }

  //The start time will never be greater than or equal to the end time.
  //I have implemented this validation in the updateOfferedCourseZodSchema.

  //check faculty id is existed or not
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, 'Faculty is not found.');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  //check status of semester registration
  const checkStatus = await SemesterRegistration.findById(semesterRegistration);
  if (checkStatus?.status !== 'UPCOMING') {
    throw new AppError(
      status.BAD_REQUEST,
      `You can not update this ${checkStatus?.status} semester.`,
    );
  }

  //resolve time conflict for a faculty
  const assignedSchedules = await OfferedCourse.find(
    //only filter for matching days
    { semesterRegistration, faculty, days: { $in: days } }, //es6 style
    { days: 1, startTime: 1, endTime: 1, _id: 0 },
  );
  const newSchedule: TSchedule = {
    days,
    startTime,
    endTime,
  };
  if (checkTimeConflictForFaculty(assignedSchedules, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      'This faculty is not available at this time. Choose another time or day.',
    );
  }

  //now update data
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, 'Offered course not found.');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      status.BAD_REQUEST,
      'You can not delete any ONGOING or ENDED semester.',
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  /*
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Offered course not found.');
  }
  */
  return result;
};

export const offeredCourseService = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteAOfferedCourseFromDB,
};
