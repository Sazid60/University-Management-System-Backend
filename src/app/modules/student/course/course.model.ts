import { model, Schema } from 'mongoose';
import {
  TCourseFaculty,
  TCourses,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCourses = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
// Why Use a Sub-Schema?
// By creating a separate schema for preRequisiteCourses, you gain more flexibility:

// You can add fields like isDeleted, notes, addedBy, etc.

// You can embed more metadata with each prerequisite reference.

// You can still populate the referenced Course data using Mongoose.

const courseSchema = new Schema<TCourses>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisiteCourses: [preRequisiteCourses],
  // array of the preRequisite Courses

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Course = model<TCourses>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      unique: true,
    },
  ],
});

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
