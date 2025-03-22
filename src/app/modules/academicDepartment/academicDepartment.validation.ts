import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department Is Invalid',
      required_error: 'Name Is Required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Department Is Invalid',
      required_error: 'Faculty Is Required',
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department Is Invalid',
        required_error: 'Name Is Required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Department Is Invalid',
        required_error: 'Faculty Is Required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
