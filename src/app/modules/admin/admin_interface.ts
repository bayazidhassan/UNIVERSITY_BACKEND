import { Model, Types } from 'mongoose';
import { TBloodGroup, TGender, TName } from '../student/student_interface';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TName;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg: string;
  isDeleted: boolean;
};

export interface adminModel extends Model<TAdmin> {
  isAdminExists(adminId: string): Promise<TAdmin | null>;
}
