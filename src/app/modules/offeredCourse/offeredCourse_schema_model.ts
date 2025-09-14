import { model, Schema } from 'mongoose';
import { TDays, TOfferedCourse } from './offeredCourse_Interface';

export const Days: TDays[] = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: [true, 'Semester registration is required.'],
      ref: 'SemesterRegistration', //reference model name
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester is required.'],
      ref: 'AcademicSemester', //reference model name
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty is required.'],
      ref: 'AcademicFaculty', //reference model name
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is required.'],
      ref: 'AcademicDepartment', //reference model name
    },
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course is required.'],
      ref: 'Course', //reference model name
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Faculty is required.'],
      ref: 'Faculty', //reference model name
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required.'],
    },
    section: {
      type: Number,
      required: [true, 'Section is required.'],
    },
    days: {
      type: [String],
      required: [true, 'Days are required.'],
      enum: {
        values: Days,
        message: 'Days must be Sat, Sun, Mon, Tue, Wed, Thu or Fri.',
      },
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required.'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required.'],
    },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
