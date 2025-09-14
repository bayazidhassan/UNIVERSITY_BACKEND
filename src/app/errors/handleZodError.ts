import * as z from 'zod';
import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleZodError = (err: z.ZodError): TGenericErrorResponse => {
  const errorSource: TErrorSource = err.issues.map((issue) => {
    return {
      path: String(issue?.path[issue.path.length - 1]),
      message: issue?.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};
