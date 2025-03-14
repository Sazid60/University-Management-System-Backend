import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is Required')
    .max(20, 'Name cannot be more than 20 characters')
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(1, 'Last Name is Required').trim(),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim(),
  fatherOccupation: z.string().min(1, 'Father Occupation is Required').trim(),
  fatherContactNo: z.string().min(1, 'Father Contact No Required').trim(),
  motherName: z.string().min(1, 'Mother Name is Required').trim(),
  motherOccupation: z.string().min(1, 'Mother Occupation is Required').trim(),
  motherContactNo: z.string().min(1, 'Mother Contact No Required').trim(),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name Required').trim(),
  occupation: z.string().min(1, 'Local Guardian Occupation Required').trim(),
  contactNo: z.string().min(1, 'Local Guardian Contact No Required').trim(),
  address: z.string().min(1, 'Local Guardian Address Required').trim(),
});

const studentValidationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  user: z.string().min(1, 'User ID is required'),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender is not valid' }),
  }),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Invalid email format'),
  contactNo: z.string().min(1, 'Contact No Required').trim(),
  emergencyContactNo: z.string().min(1, 'Emergency Contact No Required').trim(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().min(1, 'Present Address Required').trim(),
  permanentAddress: z.string().min(1, 'Permanent Address Required').trim(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().min(1, 'Profile Image Required').trim(),
  isDeleted: z.boolean().default(false),
});

export default studentValidationSchema;
