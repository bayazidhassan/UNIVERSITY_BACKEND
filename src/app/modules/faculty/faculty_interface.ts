import { Model, Types } from 'mongoose';
import { TBloodGroup, TGender, TName } from '../student/student_interface';

export type TFaculty = {
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
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

//for custom static method
//This tells TypeScript: “My Faculty model will have a method called isFacultyExists that takes an ID and returns a faculty or null.”
export interface facultyModel extends Model<TFaculty> {
  isFacultyExists(adminId: string): Promise<TFaculty | null>;
}
