import { model, Schema } from 'mongoose';
import {
  bloodGroup,
  gender,
  nameSchema,
} from '../student/student_schema_model';
import { facultyModel, TFaculty } from './faculty_interface';

//const facultySchema = new Schema<TFaculty>(
const facultySchema = new Schema<TFaculty, facultyModel>( //for custom static method
  {
    id: {
      type: String,
      required: [true, 'ID is required.'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required.'],
      unique: true,
      ref: 'User', //model name, for populate referencing
    },
    designation: {
      type: String,
      required: [true, 'Designation is required.'],
    },
    name: nameSchema,
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: gender,
        message: 'Gender must be male, female, or other',
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: bloodGroup,
        message: 'Blood group must be A+, A-, B+, B-, AB+, AB-, O+ or O-',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: {
      type: String,
      //required: [true, 'Profile image is required'],
      default: '',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department reference is required'],
      ref: 'AcademicDepartment', //model name, for populate referencing
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

/*
facultySchema.pre('find', function (next) {
  //here this refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('findOne', function (next) {
  //here this refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('findOneAndUpdate', function (next) {
  //here this refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });
  next();
});
*/

facultySchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  //here this refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });
  next();
});

//for custom static method
facultySchema.static('isFacultyExists', async function (facultyId: string) {
  return await this.findOne({ id: facultyId }); //here 'this' refers to the Model
});

//export const Faculty = model<TFaculty>('Faculty', facultySchema);
export const Faculty = model<TFaculty, facultyModel>('Faculty', facultySchema); //for custom static method
