import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty_interface';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: [true, 'Academic faculty name is required.'],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicFaculty = model('AcademicFaculty', academicFacultySchema);
