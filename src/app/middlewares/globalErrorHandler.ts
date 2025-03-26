/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  type TErrorSource = {
    path: string | number;
    message: string;
  }[];

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // To checking class, subclass or instance we have to use instanceof operator
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Ami Zod Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
  });
};

export default globalErrorHandler;
