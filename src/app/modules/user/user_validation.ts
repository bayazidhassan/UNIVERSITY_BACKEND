import * as z from 'zod';
import { TStatus, TUserRole } from './user_interface';

const userRole: TUserRole[] = ['student', 'faculty', 'admin', 'super_admin'];
const status: TStatus[] = ['in_progress', 'block'];

export const createUserZodSchema = z.object({
  id: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'User ID is required.'
        : 'User ID must be a string.',
  }),
  email: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Email is required.'
        : 'Email must be a string.',
  }),
  password: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Password is required.'
          : 'Password must be a string.',
    })
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(15, { message: 'Password must not exceed 15 characters.' }),
  needsPasswordChange: z.boolean().default(true),
  //role: z.enum(['student', 'faculty', 'admin', 'super_admin'], {
  role: z.enum(userRole, {
    error: () => 'User role must be student, faculty, admin or super_admin',
  }),
  status: z
    .enum(status, {
      error: () => 'Status must be either in_progress or block.',
    })
    .default('in_progress'),
  isDeleted: z.boolean().default(false),
});

const userStatusChangeZodSchema = z.object({
  status: z
    .enum(status, {
      error: () => 'Status must be either in_progress or block.',
    })
    .default('in_progress'),
});

export const userValidation = {
  createUserZodSchema,
  userStatusChangeZodSchema,
};
