import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is Required')
    .max(20, 'Name cannot be more than 20 characters')
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(1, 'Last Name is Required').trim(),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim(),
  fatherOccupation: z.string().min(1, 'Father Occupation is Required').trim(),
  fatherContactNo: z.string().min(1, 'Father Contact No Required').trim(),
  motherName: z.string().min(1, 'Mother Name is Required').trim(),
  motherOccupation: z.string().min(1, 'Mother Occupation is Required').trim(),
  motherContactNo: z.string().min(1, 'Mother Contact No Required').trim(),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name Required').trim(),
  occupation: z.string().min(1, 'Local Guardian Occupation Required').trim(),
  contactNo: z.string().min(1, 'Local Guardian Contact No Required').trim(),
  address: z.string().min(1, 'Local Guardian Address Required').trim(),
});

export const createStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender is not valid' }),
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email format'),
      contactNo: z.string().min(1, 'Contact No Required').trim(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact No Required')
        .trim(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present Address Required').trim(),
      permanentAddress: z.string().min(1, 'Permanent Address Required').trim(),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      profileImg: z.string().min(1, 'Profile Image Required').trim(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

//  for updating
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is Required')
    .max(20, 'Name cannot be more than 20 characters')
    .trim()
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(1, 'Last Name is Required').trim().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim().optional(),
  fatherOccupation: z
    .string()
    .min(1, 'Father Occupation is Required')
    .trim()
    .optional(),
  fatherContactNo: z
    .string()
    .min(1, 'Father Contact No Required')
    .trim()
    .optional(),
  motherName: z.string().min(1, 'Mother Name is Required').trim().optional(),
  motherOccupation: z
    .string()
    .min(1, 'Mother Occupation is Required')
    .trim()
    .optional(),
  motherContactNo: z
    .string()
    .min(1, 'Mother Contact No Required')
    .trim()
    .optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name Required').trim().optional(),
  occupation: z
    .string()
    .min(1, 'Local Guardian Occupation Required')
    .trim()
    .optional(),
  contactNo: z
    .string()
    .min(1, 'Local Guardian Contact No Required')
    .trim()
    .optional(),
  address: z
    .string()
    .min(1, 'Local Guardian Address Required')
    .trim()
    .optional(),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z
        .enum(['male', 'female', 'other'], {
          errorMap: () => ({ message: 'Gender is not valid' }),
        })
        .optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email format').optional(),
      contactNo: z.string().min(1, 'Contact No Required').trim().optional(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact No Required')
        .trim()
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string()
        .min(1, 'Present Address Required')
        .trim()
        .optional(),
      permanentAddress: z
        .string()
        .min(1, 'Permanent Address Required')
        .trim()
        .optional(),
      guardian: updateGuardianValidationSchema,
      localGuardian: updateLocalGuardianValidationSchema,
      profileImg: z.string().min(1, 'Profile Image Required').trim().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});
export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
