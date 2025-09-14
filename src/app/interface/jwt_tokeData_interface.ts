import { TUserRole } from '../modules/user/user_interface';

export interface JwtDecoded {
  data: {
    userId: string;
    role: TUserRole;
  };
  iat: number;
  exp: number;
}
