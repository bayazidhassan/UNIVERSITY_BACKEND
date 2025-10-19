import mongoose from 'mongoose';
import * as z from 'zod';

const createEnrolledCourseZodSchema = z.object({
  offeredCourse: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
});

const updateEnrolledCourseMarksZodSchema = z.object({
  semesterRegistration: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  offeredCourse: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  student: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  courseMarks: z.object({
    classTest1: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Marks of class test-1 is required.'
            : 'Marks of class test-1 must be a number.',
      })
      .min(0, { message: 'Marks of class test-1 cannot be less than 0.' })
      .max(10, { message: 'Marks of class test-1 cannot be more than 10.' })
      .optional(),
    midTerm: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Marks of class mid-term is required.'
            : 'Marks of class mid-term must be a number.',
      })
      .min(0, { message: 'Marks of class mid-term cannot be less than 0.' })
      .max(30, { message: 'Marks of class mid-term cannot be more than 30.' })
      .optional(),
    classTest2: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Marks of class test-2 is required.'
            : 'Marks of class test-2 must be a number.',
      })
      .min(0, { message: 'Marks of class test-2 cannot be less than 0.' })
      .max(10, { message: 'Marks of class test-2 cannot be more than 10.' })
      .optional(),
    finalTerm: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Marks of class final-term is required.'
            : 'Marks of class final-term must be a number.',
      })
      .min(0, { message: 'Marks of class final-term cannot be less than 0.' })
      .max(50, { message: 'Marks of class final-term cannot be more than 50.' })
      .optional(),
  }),
});

export const enrolledCourseValidation = {
  createEnrolledCourseZodSchema,
  updateEnrolledCourseMarksZodSchema,
};
