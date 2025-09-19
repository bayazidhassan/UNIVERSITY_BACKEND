import jwt, { SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwt_payload: { userId: string; role: string },
  secret: string,
  expiresIn: SignOptions['expiresIn'],
): string => {
  return jwt.sign(
    {
      data: jwt_payload,
    },
    secret,
    //{ expiresIn: 60 * 60 },
    //{ expiresIn: '1h' },
    {
      //expiresIn,
      expiresIn: expiresIn,
    },
  );
};
