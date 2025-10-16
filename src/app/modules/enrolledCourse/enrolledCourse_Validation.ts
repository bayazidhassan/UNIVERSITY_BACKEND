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

export const enrolledCourseValidation = {
  createEnrolledCourseZodSchema,
};
