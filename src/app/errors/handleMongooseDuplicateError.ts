import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleMongooseDuplicateError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
): TGenericErrorResponse => {
  //E11000 duplicate key error collection: UNIVERSITY_BACKEND.students index: email_1 dup key: { email: "bayazid1@gmail.com" }
  const match = err.message.match(/"([^"]*)"/); //matches text inside double quotes.
  const extractedMessage = match && match[1]; //safely avoids errors if nothing is matched && returns the captured string.

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
