import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleMongooseDuplicateError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSource: TErrorSource[] = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate Error',
    errorSource,
  };
};
