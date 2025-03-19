import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);
// same year same semester can not be created again we have to take in our mind
academicSemesterSchema.pre('save', async function (next) {
  // this next is mongoose's next
  const isSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExist) {
    throw new Error('Semester Is Already exist');
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);

// Name Year
//2030 Autumn => Created
// 2031 Autumn
//2030 Autumn => XXX
//2030 Fall => Created

// Autumn 01
// Summar 02
// Fall 03
