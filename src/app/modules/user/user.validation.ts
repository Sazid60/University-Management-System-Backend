import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password Must Be String',
    })
    .max(20, { message: 'Pass can not be more than 20 char' })
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};
