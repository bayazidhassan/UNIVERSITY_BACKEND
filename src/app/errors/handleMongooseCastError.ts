import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleMongooseCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid mongoose ID',
    errorSource,
  };
};
