//import { JwtPayload } from 'jsonwebtoken';
import { JwtDecoded } from './jwt_tokeData_interface';

declare module 'express-serve-static-core' {
  interface Request {
    //user?: JwtPayload; //Adds user property to Express’ Request.
    user?: JwtDecoded; //Adds user property to Express’ Request.
  }
}
