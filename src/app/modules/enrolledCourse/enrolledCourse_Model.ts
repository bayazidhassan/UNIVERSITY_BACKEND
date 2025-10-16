import { model, Schema } from 'mongoose';
import {
  TCourseMarks,
  TEnrolledCourse,
  TGrade,
} from './enrolledCourse_Interface';

const grade: TGrade[] = ['A', 'B', 'C', 'D', 'F', 'NA'];

const courseMarksSchema = new Schema<TCourseMarks>(
  {
    classTest1: {
      type: Number,
      default: 0,
    },
    midTerm: {
      type: Number,
      default: 0,
    },
    classTest2: {
      type: Number,
      default: 0,
    },
    finalTerm: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const enrollCourseSchema = new Schema<TEnrolledCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: [true, 'Semester registration id is required.'],
      ref: 'SemesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester id is required.'],
      ref: 'AcademicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty id is required.'],
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department id is required.'],
      ref: 'AcademicDepartment',
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      required: [true, 'Offered course id is required.'],
      ref: 'OfferedCourse',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course id is required.'],
      ref: 'Course',
    },
    student: {
      type: Schema.Types.ObjectId,
      required: [true, 'Student id is required.'],
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Faculty id is required.'],
      ref: 'Faculty',
    },
    isEnrolled: {
      type: Boolean,
      default: false,
    },
    courseMarks: {
      type: courseMarksSchema,
      default: {},
    },
    grade: {
      type: String,
      enum: {
        values: grade,
        message: 'Grade must be A, B, C, D, F or NA',
      },
      default: 'NA',
    },
    gradePoints: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrollCourseSchema,
);
