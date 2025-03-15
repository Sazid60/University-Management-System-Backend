/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = status.NOT_FOUND;

  return res.status(statusCode).json({
    success: false,
    message: 'API Not Found',
    error: '',
  });
};

export default notFound;
