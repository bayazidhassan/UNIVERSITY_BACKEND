import * as z from 'zod';

export const academicFacultyValidation = z.object({
  name: z
    .string({
      error: (ctx) =>
        ctx.input === undefined
          ? 'Academic faculty name is required.'
          : 'Name must be a string.',
    })
    .trim()
    .max(50, { message: 'Name must be at most 30 characters long.' })
    .regex(/^[A-Za-z ]+$/, {
      message: 'Name must contains only alphabets.',
    }),
});
