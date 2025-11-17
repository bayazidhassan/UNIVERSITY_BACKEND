import { RequestHandler } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { JwtDecoded } from '../interface/jwt_tokeData_interface';
import { TUserRole } from '../modules/user/user_interface';
import { User } from '../modules/user/user_schema_model';

//...requiredRoles (rest parameter, must be an array type)
const auth = (...requiredRoles: TUserRole[]): RequestHandler => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    //check token is given or not
    if (!token) {
      throw new AppError(status.NOT_FOUND, 'Token is not found.');
    }

    //authentication(check token is valid or not)
    let isVerified;
    try {
      isVerified = jwt.verify(
        token,
        config.jwt_access_token as string,
      ) as JwtDecoded;
    } catch {
      throw new AppError(status.UNAUTHORIZED, 'Token is expired.');
    }

    //check user is not found or deleted or blocked
    const isUserExists = await User.isUserExists(isVerified.data.userId); //custom static method
    if (!isUserExists) {
      throw new AppError(
        status.UNAUTHORIZED,
        'User is not found or deleted or blocked.',
      );
    }

    //authorization(check valid user role for valid route)
    if (requiredRoles.length && !requiredRoles.includes(isVerified.data.role)) {
      throw new AppError(
        status.UNAUTHORIZED,
        'You are not allowed to access this route.',
      );
    }

    //check password is changed or not
    const iat_Date = new Date(isVerified.iat * 1000);
    const passwordChangeDate = isUserExists.passwordChangedAt
      ? new Date(isUserExists.passwordChangedAt)
      : null;
    if (passwordChangeDate && passwordChangeDate > iat_Date) {
      throw new AppError(status.UNAUTHORIZED, 'Invalid token.');
    }

    req.user = isVerified;
    /*
    By default, TypeScript doesn’t know req.user exists.
    So if you try to assign it, TS will throw an error: Property 'user' does not exist on type 'Request'.
    at first extend Express’ Request type so you can safely attach custom properties.
    */
    next();
  };
};

export default auth;
