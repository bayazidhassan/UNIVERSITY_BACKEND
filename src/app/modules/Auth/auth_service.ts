import bcrypt from 'bcrypt';
import status from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { JwtDecoded } from '../../interface/jwt_tokeData_interface';
import { User } from '../user/user_schema_model';
import { TLoginUser } from './auth_interface';
import { createToken } from './auth_utils';

const loginUserIntoDB = async (payload: TLoginUser) => {
  const { id, password } = payload;

  //user exists or not
  //const isUserExists = await User.findOne({ id: id }).select('+password');
  const isUserExists = await User.isUserExists(id); //custom static method
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found.');
  }

  //check password match
  /*
  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExists.password,
  );
  */
  //by using custom static method
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExists.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(status.FORBIDDEN, 'Password does not match.');
  }

  //create jwt token and send it to the client
  const jwt_payload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };
  //create access token
  const jwt_accessToken = jwt.sign(
    {
      data: jwt_payload,
    },
    config.jwt_access_token as string,
    //{ expiresIn: 60 * 60 },
    //{ expiresIn: '1h' },
    {
      expiresIn: config.jwt_access_expire_in as SignOptions['expiresIn'],
    },
  );
  //create refresh token (by using createToken function)
  const jwt_refreshToken = createToken(
    jwt_payload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expire_in as SignOptions['expiresIn'],
  );

  return {
    jwt_accessToken,
    jwt_refreshToken,
    needsPasswordChange: isUserExists.needPasswordChange,
  };
};

const changePasswordIntoDB = async (
  //user: JwtPayload,
  user: JwtDecoded,
  passwordData: { old_password: string; new_password: string },
) => {
  //user exists or not
  const isUserExists = await User.isUserExists(user.data.userId); //custom static method
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found.');
  }

  //check password match
  const isPasswordMatched = await User.isPasswordMatched(
    passwordData.old_password,
    isUserExists.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(status.FORBIDDEN, 'Old Password does not match.');
  }

  const newHashedPassword = await bcrypt.hash(
    passwordData.new_password,
    Number(config.bcrypt_salt),
  );

  await User.findOneAndUpdate(
    { id: user.data.userId, role: user.data.role },
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  return null;
};

const refreshToken = async (token: string) => {
  //authentication(check token is valid or not)
  /*
  There is no problem if you don’t use await with jwt.verify in your code,
  because jwt.verify (without a callback) is synchronous and immediately returns the decoded payload or throws an error, which your catchAsync function will handle.
  */
  const payload = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtDecoded;

  //check user is not found or deleted or blocked
  const isUserExists = await User.isUserExists(payload.data.userId); //custom static method
  if (!isUserExists) {
    throw new AppError(
      status.UNAUTHORIZED,
      'User is not found or deleted or blocked.',
    );
  }

  //check password is changed or not
  const iat_Date = new Date(payload.iat * 1000);
  const passwordChangeDate = isUserExists.passwordChangedAt
    ? new Date(isUserExists.passwordChangedAt)
    : null;
  if (passwordChangeDate && passwordChangeDate > iat_Date) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid token.');
  }

  //create access token
  const jwt_payload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };
  const jwt_accessToken = jwt.sign(
    {
      data: jwt_payload,
    },
    config.jwt_access_token as string,
    //{ expiresIn: 60 * 60 },
    //{ expiresIn: '1h' },
    {
      expiresIn: config.jwt_access_expire_in as SignOptions['expiresIn'],
    },
  );

  return { jwt_accessToken };
};

export const authService = {
  loginUserIntoDB,
  changePasswordIntoDB,
  refreshToken,
};
