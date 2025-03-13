import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password Must Be String',
    })
    .max(20, { message: 'Pass can not be more than 20 char' })
    .optional(),
  //   needsPasswordChange: z.boolean().optional().default(true),
  //   role: z.enum(['student', 'admin', 'faculty']),
  //   status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  //   isDeleted: z.boolean().optional().default(false),
  // these will be done by server or the default value is there which will be set by server as well. so in zod those are not required.
});

export const UserValidation = {
  userValidationSchema,
};
