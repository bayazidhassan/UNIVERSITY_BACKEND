import mongoose from 'mongoose';
import * as z from 'zod';
import { status } from './semesterRegistration_schema_model';
const createSemesterRegistrationZodSchema = z.object({
  academicSemester: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  status: z.enum(status, {
    error: () => 'Status must be UPCOMING, ONGOING or ENDED.',
  }),
  startDate: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Start date is required.'
          : 'Start date must be a string.',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message:
        'Invalid date format. Use YYYY-MM-DD or a valid ISO date string.',
    })
    .transform((val) => new Date(val)),
  endDate: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'End date is required.'
          : 'End date must be a string.',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message:
        'Invalid date format. Use YYYY-MM-DD or a valid ISO date string.',
    })
    .transform((val) => new Date(val)),
  minCredit: z.number({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Minimum credit is required.'
        : 'Minimum credit must be a number.',
  }),
  maxCredit: z.number({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Maximum credit is required.'
        : 'Maximum credit must be a number.',
  }),
});

const updateSemesterRegistrationZodSchema =
  createSemesterRegistrationZodSchema.partial();

export const semesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
