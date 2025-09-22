import { model, Schema } from 'mongoose';
import {
  TSemesterRegistration,
  TSemesterRegistrationStatus,
} from './semesterRegistration_interface';

export const status: TSemesterRegistrationStatus[] = [
  'UPCOMING',
  'ONGOING',
  'ENDED',
];

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester is required.'],
      unique: true,
      ref: 'AcademicSemester', //reference model name
    },
    status: {
      type: String,
      required: [true, 'Status is required.'],
      enum: {
        values: status,
        message: 'Status must be UPCOMING, ONGOING or ENDED.',
      },
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },
    minCredit: {
      type: Number,
      required: [true, 'Minimum credit is required.'],
      default: 3,
    },
    maxCredit: {
      type: Number,
      required: [true, 'Maximum credit is required.'],
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
