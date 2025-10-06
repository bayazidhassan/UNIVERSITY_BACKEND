import { Model } from 'mongoose';

export type TUserRole = 'student' | 'faculty' | 'admin';
export type TStatus = 'in_progress' | 'block';

export type TUser = {
  id: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: TStatus;
  isDeleted: boolean;
};

export const USER_ROLE = {
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const;

//for custom static method
//This tells TypeScript: “My User model will have a method called isUserExists that takes an ID and returns a user or null.”
export interface userModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordMatched(password: string, hashPassword: string): Promise<boolean>;
}
