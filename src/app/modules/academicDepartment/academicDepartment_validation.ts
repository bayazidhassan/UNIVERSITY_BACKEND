import mongoose from 'mongoose';
import * as z from 'zod';
export const academicDepartmentValidation = z.object({
  name: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Academic department name is required.'
          : 'Name must be a string.',
    })
    .trim()
    .max(50, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Za-z ]+$/, {
      message: 'Name must contains only alphabets.',
    }),
  academicFaculty: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId string',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
});
