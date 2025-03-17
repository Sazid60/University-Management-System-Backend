import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // if everything alright next()
    try {
      await schema.parseAsync({
        body: req.body,
      });
      // validation

      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
