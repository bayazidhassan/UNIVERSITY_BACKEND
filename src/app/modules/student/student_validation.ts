import mongoose from 'mongoose';
import * as z from 'zod';
import { bloodGroup, gender } from './student_schema_model';

export const nameZodSchema = z.object({
  firstName: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'First name is required.'
          : 'First name must be a string.',
    })
    .trim()
    .max(30, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
      message:
        'Name must start with a capital letter and contain only alphabets.',
    }),
  lastName: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Last name is required.'
          : 'Last name must be a string.',
    })
    .trim()
    .max(30, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
      message:
        'Name must start with a capital letter and contain only alphabets.',
    }),
});

export const updateNameZodSchema = z.object({
  firstName: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'First name is required.'
          : 'First name must be a string.',
    })
    .trim()
    .max(30, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
      message:
        'Name must start with a capital letter and contain only alphabets.',
    })
    .optional(),
  lastName: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Last name is required.'
          : 'Last name must be a string.',
    })
    .trim()
    .max(30, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
      message:
        'Name must start with a capital letter and contain only alphabets.',
    })
    .optional(),
});

const guardianZodSchema = z.object({
  name: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Guardian name is required.'
        : 'Guardian name must be a string.',
  }),
  relation: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Guardian relation is required.'
        : 'Guardian relation must be a string.',
  }),
  contactNo: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Guardian contact number is required.'
        : 'Guardian contact number must be a string.',
  }),
});

const updateGuardianZodSchema = z.object({
  name: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Guardian name is required.'
          : 'Guardian name must be a string.',
    })
    .optional(),
  relation: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Guardian relation is required.'
          : 'Guardian relation must be a string.',
    })
    .optional(),
  contactNo: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Guardian contact number is required.'
          : 'Guardian contact number must be a string.',
    })
    .optional(),
});

/*
const gender: TGender[] = ['male', 'female', 'other'];
const bloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];
*/

const createStudentZodSchema = z.object({
  password: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Password is required.'
          : 'Password must be a string.',
    })
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(15, { message: 'Password must not exceed 15 characters.' })
    .optional(),
  student: z.object({
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
    guardian: guardianZodSchema,
    localGuardian: guardianZodSchema,
    /*
    profileImg: z.string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Profile image link is required.'
          : 'Profile image link must be a string.',
    }),
    */
    admissionSemester: z
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
  }),
});

const updateStudentZodSchema = z.object({
  student: z.object({
    name: updateNameZodSchema.optional(),
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
    guardian: updateGuardianZodSchema.optional(),
    localGuardian: updateGuardianZodSchema.optional(),
    /*
    profileImg: z
      .string({
        error: (ctx) =>
          ctx.input === undefined
            ? 'Profile image link is required.'
            : 'Profile image link must be a string.',
      })
      .optional(),
    */
    admissionSemester: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId string',
      })
      .transform((val) => new mongoose.Types.ObjectId(val))
      .optional(),
    academicDepartment: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId string',
      })
      .transform((val) => new mongoose.Types.ObjectId(val))
      .optional(),
  }),
});

export const studentValidation = {
  createStudentZodSchema,
  updateStudentZodSchema,
};
