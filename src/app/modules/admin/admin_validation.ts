import * as z from 'zod';
import { bloodGroup, gender } from '../student/student_schema_model';
import {
  nameZodSchema,
  updateNameZodSchema,
} from '../student/student_validation';
const createAdminZodSchema = z.object({
  password: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Password is required.'
          : 'Password must be a string.',
    })
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(15, { message: 'Password must not exceed 15 characters.' }),
  admin: z.object({
    designation: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Designation is required.'
          : 'Designation must be a string.',
    }),
    name: nameZodSchema,
    gender: z.enum(gender, {
      error: () => 'Gender must be one of: male, female, or other.',
    }),
    dateOfBirth: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Date of birth is required.'
            : 'Date of birth must be a string.',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message:
          'Invalid date format. Use YYYY-MM-DD or a valid ISO date string.',
      })
      .transform((val) => new Date(val)),
    /*
        //z.date() in Zod expects an actual JavaScript Date object — not a string like "2001-01-01".
        dateOfBirth: z.date({
          error: (ctx) =>
            ctx.input === undefined
              ? 'Date of birth is required.'
              : 'Invalid date format.',
        }),
        */
    email: z.email({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Email is required.'
          : 'Invalid email format.',
    }),
    contactNo: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Contact number is required.'
          : 'Contact number must be a string.',
    }),
    emergencyContactNo: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Emergency contact number is required.'
          : 'Emergency contact number must be a string.',
    }),
    bloodGroup: z.enum(bloodGroup, {
      error: () => 'Blood group must be A+, A-, B+, B-, AB+, AB-, O+ or O-',
    }),
    presentAddress: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Present address is required.'
          : 'Present address must be a string.',
    }),
    permanentAddress: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Permanent address is required.'
          : 'Permanent address must be a string.',
    }),
    profileImg: z
      .string({
        error: () => 'Profile image must be a string.',
      })
      .optional(),
  }),
});

const updateAdminZodSchema = z.object({
  admin: z.object({
    designation: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Designation is required.'
            : 'Designation must be a string.',
      })
      .optional(),
    name: updateNameZodSchema,
    gender: z
      .enum(gender, {
        error: () => 'Gender must be one of: male, female, or other.',
      })
      .optional(),
    dateOfBirth: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Date of birth is required.'
            : 'Date of birth must be a string.',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message:
          'Invalid date format. Use YYYY-MM-DD or a valid ISO date string.',
      })
      .transform((val) => new Date(val))
      .optional(),
    /*
        //z.date() in Zod expects an actual JavaScript Date object — not a string like "2001-01-01".
        dateOfBirth: z.date({
          error: (ctx) =>
            ctx.input === undefined
              ? 'Date of birth is required.'
              : 'Invalid date format.',
        }),
        */
    email: z
      .email({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Email is required.'
            : 'Invalid email format.',
      })
      .optional(),
    contactNo: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Contact number is required.'
            : 'Contact number must be a string.',
      })
      .optional(),
    emergencyContactNo: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Emergency contact number is required.'
            : 'Emergency contact number must be a string.',
      })
      .optional(),
    bloodGroup: z
      .enum(bloodGroup, {
        error: () => 'Blood group must be A+, A-, B+, B-, AB+, AB-, O+ or O-',
      })
      .optional(),
    presentAddress: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Present address is required.'
            : 'Present address must be a string.',
      })
      .optional(),
    permanentAddress: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Permanent address is required.'
            : 'Permanent address must be a string.',
      })
      .optional(),
    profileImg: z
      .string({
        error: () => 'Profile image must be a string.',
      })
      .optional(),
  }),
});

export const adminValidation = {
  createAdminZodSchema,
  updateAdminZodSchema,
};
