import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from './errorInterface';

/*
### Common cases when a Mongoose validation error occurs

1. Required fields missing
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

await User.create({}); 
// ValidationError: Path `name` is required.

2. Invalid type that cannot be cast
const schema = new mongoose.Schema({
  age: { type: Number }
});

await Model.create({ age: "abc" }); 
// ValidationError: Cast to Number failed for value "abc"

3. Failing built-in validators
const schema = new mongoose.Schema({
  email: { type: String, match: /.+\@.+\..+/ }
});

await Model.create({ email: "not-an-email" });
// ValidationError: Path `email` is invalid

4. Failing custom validators
const schema = new mongoose.Schema({
  age: {
    type: Number,
    validate: {
      validator: v => v >= 18,
      message: 'Age must be at least 18'
    }
  }
});

await Model.create({ age: 15 });
// ValidationError: Age must be at least 18

5. Unique index conflict
⚠️ Careful: this is not a validation error.
A duplicate key (e.g., same email with { unique: true }) throws a MongoServerError (code 11000), not a ValidationError.
You catch it separately.
*/

export const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = Object.values(err.errors).map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: error?.path,
      message: error?.message,
    }),
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};
