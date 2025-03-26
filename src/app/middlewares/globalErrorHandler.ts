/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // To checking class, subclass or instance we have to use instanceof operator
  //  we are detecting here that this is a zod error
  if (err instanceof ZodError) {
    // now we will send the error to the handler
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    //  now we will be doing over write
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
