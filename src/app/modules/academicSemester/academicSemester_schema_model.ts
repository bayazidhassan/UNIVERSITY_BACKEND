import { model, Schema } from 'mongoose';
import { code, months, semesterName } from './academicSemester_constant';
import { TAcademicSemester } from './academicSemester_interface';

const academicSemester_Schema = new Schema<TAcademicSemester>(
  {
    semesterName: {
      type: String,
      required: [true, 'Semester name is required.'],
      enum: {
        values: semesterName,
        message: 'Semester name must be one of: Autumn, Summer, or Fall.',
      },
    },
    year: {
      type: String,
      required: [true, 'Year  is required.'],
    },
    code: {
      type: String,
      required: [true, 'Code is required.'],
      enum: {
        values: code,
        message: 'Code must be one of: 01, 02, or 03',
      },
    },
    startMonth: {
      type: String,
      required: [true, 'Start month is required.'],
      enum: {
        values: months,
        message: 'Month must be a valid month from January to December',
      },
    },
    endMonth: {
      type: String,
      required: [true, 'Start month is required.'],
      enum: {
        values: months,
        message: 'Month must be a valid month from January to December',
      },
    },
  },
  {
    timestamps: true,
  },
);

//I can also implement this logic in service
academicSemester_Schema.pre('save', async function () {
  const isSemesterExists = await AcademicSemester.findOne({
    semesterName: this.semesterName,
    year: this.year,
  });
  if (isSemesterExists) {
    throw new Error(
      `You have already created this semester: ${this.semesterName}, ${this.year}`,
    );
  }
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemester_Schema,
);
