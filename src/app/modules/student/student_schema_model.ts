import mongoose, { model, Schema } from 'mongoose';
import {
  studentModel,
  TBloodGroup,
  TGender,
  TGuardian,
  TName,
  TStudent,
} from './student_interface';
mongoose.Schema.Types.String.cast(false);
mongoose.Schema.Types.Number.cast(false);

export const nameSchema = new Schema<TName>(
  {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
  },
  { _id: false },
);

const guardianSchema = new Schema<TGuardian>(
  {
    name: { type: String, required: [true, 'Guardian name is required'] },
    relation: {
      type: String,
      required: [true, 'Guardian relation is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Guardian contact number is required'],
    },
  },
  { _id: false },
);

export const gender: TGender[] = ['male', 'female', 'other'];
export const bloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

//const studentSchema = new Schema<TStudent>(
const studentSchema = new Schema<TStudent, studentModel>( //for custom static method
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      //unique: [true, 'ID must be unique.'], //wrong, Mongoose does not support custom messages for unique. With unique: [true, 'msg'], Mongoose’s internal transformer rewrites the error into a MongooseError, which hides err.code
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User reference is required'],
      unique: true,
      ref: 'User', //model name, for populate referencing
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
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian info is required'],
    },
    localGuardian: {
      type: guardianSchema,
      required: [true, 'Local guardian info is required'],
    },
    profileImg: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester reference is required'],
      ref: 'AcademicSemester', //model name, for populate referencing
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
//query middleware/hook
studentSchema.pre('find', function (next) {
  //here 'this' refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });

  next();
});

//There’s no findById middleware. Use findOne instead, since findById calls findOne internally.
studentSchema.pre('findOne', function (next) {
  //here 'this' refers to the current query

  //chaining with the current query, at first filter then find
  //this.where({ isDeleted: { $ne: true } });
  this.where({ isDeleted: { $eq: false } });

  next();
});

studentSchema.pre('findOneAndUpdate', function (next) {
  //here 'this' refers to the current query

  //chaining with the current query, at first filter then find
  this.where({ isDeleted: { $ne: true } });
  //this.where({ isDeleted: { $eq: false } });
  next();
});
*/

//query middleware/hook
//There’s no findById middleware. Use findOne instead, since findById calls findOne internally.
studentSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  //here 'this' refers to the current query

  //chaining with the current query, at first filter then find
  this.where({ isDeleted: { $ne: true } });
  //this.where({ isDeleted: { $eq: false } });
  next();
});

//aggregate middleware
studentSchema.pre('aggregate', function (next) {
  //here 'this' refers to the current query

  //chaining with the current query, at first filter then find
  //this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  this.pipeline().unshift({ $match: { isDeleted: { $eq: false } } });

  next();
});

//custom static method
/*
studentSchema.statics.isStudentExists = async function (id: string) {
  //
};
*/
studentSchema.static('isStudentExists', async function (id: string) {
  return await this.findOne({ id: id }); //here 'this' refers to the Model

  /*
  When you call Student.findOne({ id: id }) from anywhere, you are executing a findOne query on the model.
  If you have a pre('findOne') middleware/hook defined on the schema, Mongoose applies all matching query
  middleware/hook automatically — so your pre('findOne') hook/middleware will always run before that findOne executes.

  One option is to bypass middleware by using Model.collection.findOne() (MongoDB driver method),
  but that skips all Mongoose features like casting and population.
  */

  //return await this.collection.findOne({ id: id }); //here 'this' refers to the Model
});

//export const Student = model<TStudent>('Student', studentSchema);
export const Student = model<TStudent, studentModel>('Student', studentSchema); //for custom static method
