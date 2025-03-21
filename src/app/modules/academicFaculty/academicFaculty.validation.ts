import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty Must be string',
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty Must be string',
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
