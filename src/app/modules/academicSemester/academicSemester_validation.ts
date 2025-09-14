import * as z from 'zod';
import { code, months, semesterName } from './academicSemester_constant';

const createAcademicSemesterZodSchema = z.object({
  semesterName: z.enum(semesterName, {
    error: () => 'Semester name must be one of: Autumn, Summer, or Fall.',
  }),
  year: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Year is required.'
        : 'Year must be a valid date string.',
  }),
  code: z.enum(code, {
    error: () => 'Code must be one of: 01, 02, or 03.',
  }),
  startMonth: z.enum(months, {
    error: () => 'Month must be a valid month from January to December.',
  }),
  endMonth: z.enum(months, {
    error: () => 'Month must be a valid month from January to December.',
  }),
});

const updateAcademicSemesterZodSchema = z
  .object({
    semesterName: z
      .enum(semesterName, {
        error: () => 'Semester name must be one of: Autumn, Summer, or Fall.',
      })
      .optional(),
    year: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Year is required.'
            : 'Year must be a valid date string.',
      })
      .optional(),
    code: z
      .enum(code, {
        error: () => 'Code must be one of: 01, 02, or 03.',
      })
      .optional(),
    startMonth: z
      .enum(months, {
        error: () => 'Month must be a valid month from January to December.',
      })
      .optional(),
    endMonth: z
      .enum(months, {
        error: () => 'Month must be a valid month from January to December.',
      })
      .optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided for update.',
  });

export const academicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
