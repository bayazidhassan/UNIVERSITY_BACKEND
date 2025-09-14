import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment_interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'User reference is required'],
      ref: 'AcademicFaculty', //model name, for populate referencing
    },
  },
  {
    timestamps: true,
  },
);

//document middleware/hook
academicDepartmentSchema.pre('save', async function (next) {
  //here 'this' refers to the current document
  const isExisted = await AcademicDepartment.findOne({ name: this.name });
  if (isExisted) {
    throw new Error(`${this.name} is already existed.`);
  }
  next();
});

//query middleware/hook
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  //console.log(query);
  const isExisted = await AcademicDepartment.findOne(query);
  if (!isExisted) {
    //throw new Error('Academic department is not found.');
    throw new AppError(404, 'Academic department is not found.');
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
