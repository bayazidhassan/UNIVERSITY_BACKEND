import { Model } from 'mongoose';

export type TUser = {
  id: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'student' | 'faculty' | 'admin';
  status: 'in_progress' | 'block';
  isDeleted: boolean;
};

export const USER_ROLE = {
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const;

//export type TUserRole = keyof USER_ROLE; //wrong, Here you wrote keyof USER_ROLE directly. But USER_ROLE is a value, not a type. keyof only works on types.
export type TUserRole = keyof typeof USER_ROLE; // 'student' | 'faculty' | 'admin'
/*
USER_ROLE → a value (the object).
typeof USER_ROLE → turns that value into its type.
keyof typeof USER_ROLE → extracts the keys(not values) of that type as a union.
*/

//for custom static method
//This tells TypeScript: “My User model will have a method called isUserExists that takes an ID and returns a user or null.”
export interface userModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordMatched(password: string, hashPassword: string): Promise<boolean>;
}
