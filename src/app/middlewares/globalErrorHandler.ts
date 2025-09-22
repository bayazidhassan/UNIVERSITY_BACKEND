import { ErrorRequestHandler } from 'express';
import * as z from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import { TErrorSource } from '../errors/errorInterface';
import { handleMongooseCastError } from '../errors/handleMongooseCastError';
import { handleMongooseDuplicateError } from '../errors/handleMongooseDuplicateError';
import { handleMongooseValidationError } from '../errors/handleMongooseValidationError';
import { handleZodError } from '../errors/handleZodError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //set default values
  let statusCode: number = 500;
  let message: string = 'Something went wrong!';
  let errorSource: TErrorSource[] = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  //check error type
  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSource = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSource = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    //error: err.message,
    stack: config.node_env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
