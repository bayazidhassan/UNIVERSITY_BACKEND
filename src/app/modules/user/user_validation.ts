import * as z from 'zod';

export const userZodSchema = z.object({
  id: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'User ID is required.'
        : 'User ID must be a string.',
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
  role: z.enum(['student', 'faculty', 'admin'], {
    error: () => 'Role must be one of: student, faculty, admin.',
  }),
  status: z
    .enum(['in_progress', 'block'], {
      error: () => 'Status must be either in_progress or block.',
    })
    .default('in_progress'),
  isDeleted: z.boolean().default(false),
});

export default userZodSchema;
