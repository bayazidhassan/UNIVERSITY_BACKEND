import { Model, Types } from 'mongoose';

export type TName = {
  firstName: string;
  lastName: string;
};

export type TGuardian = {
  name: string;
  relation: string;
  contactNo: string;
};

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TName;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TGuardian;
  profileImg: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

//for custom static method
//This tells TypeScript: “My Student model will have a method called isStudentExists that takes an ID and returns a student or null.”
export interface studentModel extends Model<TStudent> {
  isStudentExists(id: string): Promise<TStudent | null>;
}
