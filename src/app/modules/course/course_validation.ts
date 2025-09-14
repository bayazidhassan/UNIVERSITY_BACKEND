import mongoose from 'mongoose';
import * as z from 'zod';

const preRequisiteCourseZodSchema = z.object({
  course: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  isDeleted: z.boolean().default(false),
});

const createCourseZodSchema = z.object({
  course: z.object({
    title: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Course title is required.'
          : 'Course title must be a string.',
    }),
    prefix: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Course prefix is required.'
          : 'Course prefix must be a string.',
    }),
    code: z.number({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Course code is required.'
          : 'Course code must be a number.',
    }),
    credits: z.number({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Course credits is required.'
          : 'Course credits must be a number.',
    }),
    preRequisiteCourses: z.array(preRequisiteCourseZodSchema).optional(),
  }),
});

const updateCourseZodSchema = z.object({
  course: z.object({
    title: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Course title is required.'
            : 'Course title must be a string.',
      })
      .optional(),
    prefix: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Course prefix is required.'
            : 'Course prefix must be a string.',
      })
      .optional(),
    code: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Course code is required.'
            : 'Course code must be a number.',
      })
      .optional(),
    credits: z
      .number({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Course credits is required.'
            : 'Course credits must be a number.',
      })
      .optional(),
    preRequisiteCourses: z.array(preRequisiteCourseZodSchema).optional(),
  }),
});

const courseFacultiesZodSchema = z.object({
  faculties: z
    .array(
      z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId string',
        })
        .transform((val) => new mongoose.Types.ObjectId(val)),
    )
    .nonempty({ message: 'At least one faculty is required' }),
});

export const courseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
  courseFacultiesZodSchema,
};
