import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculties,
  TPreRequisiteCourse,
} from './course_interface';

export const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course references is required.'],
      ref: 'Course', //reference model name
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required.'],
      unique: true,
    },
    prefix: {
      type: String,
      required: [true, 'Course prefix is required.'],
    },
    code: {
      type: Number,
      required: [true, 'Course code is required.'],
    },
    credits: {
      type: Number,
      required: [true, 'Course credit is required.'],
    },
    preRequisiteCourses: {
      type: [preRequisiteCourseSchema],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const courseFacultiesSchema = new Schema<TCourseFaculties>({
  course: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course is required.'],
    unique: true,
    ref: 'Course', //reference model name
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      required: [true, 'Faculties are required.'],
      ref: 'Faculty', //reference model name
    },
  ],
});

export const Course = model<TCourse>('Course', courseSchema);
export const CourseFaculties = model<TCourseFaculties>(
  'CourseFaculties',
  courseFacultiesSchema,
);
