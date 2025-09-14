import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { JwtDecoded } from '../interface/jwt_tokeData_interface';
import { TUserRole } from '../modules/user/user_interface';
import { User } from '../modules/user/user_schema_model';
import catchAsync from '../utils/catchAsync';

export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtDecoded> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') return reject(err);
      resolve(decoded as JwtDecoded); // Type assertion
    });
  });
}

//...requiredRoles (rest parameter, must be an array type)
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    //check token is given or not
    if (!token) {
      throw new AppError(status.NOT_FOUND, 'Token is not found.');
    }

    //authentication(check token is valid or not)
    const payload = await verifyToken(token, config.jwt_access_token as string);

    //check user is not found or deleted or blocked
    const isUserExists = await User.isUserExists(payload.data.userId); //custom static method
    if (!isUserExists) {
      throw new AppError(
        status.UNAUTHORIZED,
        'User is not found or deleted or blocked.',
      );
    }

    //authorization(check valid user role for valid route)
    if (requiredRoles.length && !requiredRoles.includes(payload.data.role)) {
      throw new AppError(
        status.UNAUTHORIZED,
        'You are not allowed to access this route.',
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

    req.user = payload;
    /*
    By default, TypeScript doesn’t know req.user exists.
    So if you try to assign it, TS will throw an error: Property 'user' does not exist on type 'Request'.
    at first extend Express’ Request type so you can safely attach custom properties.
    */
    next();
  });
};

export default auth;
