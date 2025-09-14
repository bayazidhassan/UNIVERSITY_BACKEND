import * as z from 'zod';

const loginValidationZodSchema = z.object({
  id: z.string({
    error: (ctx) =>
      ctx.input === undefined ? 'ID is required.' : 'ID must be a string.',
  }),
  password: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Password is required.'
        : 'Password must be string.',
  }),
});

const changePasswordValidationZodSchema = z.object({
  old_password: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Old password is required.'
        : 'Old password must be a string.',
  }),
  new_password: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'New password is required.'
        : 'New password must be string.',
  }),
});

const refreshTokenValidationZodSchema = z.object({
  refreshToken: z.string({
    error: (ctx) =>
      ctx.input === undefined
        ? 'Refresh token is required.'
        : 'Refresh token must be a string.',
  }),
});

export const authValidation = {
  loginValidationZodSchema,
  changePasswordValidationZodSchema,
  refreshTokenValidationZodSchema,
};
