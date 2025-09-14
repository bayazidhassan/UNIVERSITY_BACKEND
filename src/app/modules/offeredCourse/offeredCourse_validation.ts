import mongoose from 'mongoose';
import * as z from 'zod';
import { Days } from './offeredCourse_schema_model';

const offeredCourseTimeZodSchema = z
  .string({
    error: (ctx) =>
      ctx.input === undefined ? 'Time is required.' : 'Time must be string.',
  })
  .refine((time) => /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: 'Time must be in HH:MM 24-hour format (00:00–23:59).',
  });

const createOfferedCourseZodSchema = z.object({
  semesterRegistration: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  /*
  academicSemester: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  */
  academicFaculty: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  academicDepartment: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  course: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  faculty: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  maxCapacity: z.number({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Max capacity is required.'
        : 'Max capacity must be a number.',
  }),
  section: z.number({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Section is required.'
        : 'Section must be a number.',
  }),
  /*
  days: z
    .enum(Days, {
      error: () => 'Day must be Sat, Sun, Mon, Tue, Wed, Thu or Fri.',
    })
    .array()
    .nonempty(),
  */
  days: z
    .array(
      z.enum(Days, {
        error: () => 'Day must be Sat, Sun, Mon, Tue, Wed, Thu or Fri.',
      }),
    )
    .nonempty(),
  startTime: offeredCourseTimeZodSchema,
  endTime: offeredCourseTimeZodSchema,
});
//I have also implemented this logic in service
/*
  .refine(
    ({ startTime, endTime }) => {
      //const start = new Date(`1970-01-01T${startTime}:00`);
      //const end = new Date(`1970-01-01T${endTime}:00`);
      //return end >= start;

      return endTime >= startTime //Lexicographical comparison
    },
    {
      message: 'The start time will never be greater than or equal to the end time.',
    },
  );
*/

const updateOfferedCourseZodSchema = z
  .object({
    faculty: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId string',
      })
      .transform((val) => new mongoose.Types.ObjectId(val)),
    maxCapacity: z.number({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Max capacity is required.'
          : 'Max capacity must be a number.',
    }),
    /*
  days: z
    .enum(Days, {
      error: () => 'Day must be Sat, Sun, Mon, Tue, Wed, Thu or Fri.',
    })
    .array()
    .nonempty(),
  */
    days: z
      .array(
        z.enum(Days, {
          error: () => 'Day must be Sat, Sun, Mon, Tue, Wed, Thu or Fri.',
        }),
      )
      .nonempty(),
    startTime: offeredCourseTimeZodSchema,
    endTime: offeredCourseTimeZodSchema,
  })
  .refine(
    ({ startTime, endTime }) => {
      //const start = new Date(`1970-01-01T${startTime}:00`);
      //const end = new Date(`1970-01-01T${endTime}:00`);
      //return end >= start;

      return endTime >= startTime; //Lexicographical comparison
    },
    {
      message:
        'The start time will never be greater than or equal to the end time.',
    },
  );

export const offeredCourseValidation = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
