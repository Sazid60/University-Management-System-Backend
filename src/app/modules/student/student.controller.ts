import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
// import studentValidationSchema from './student.validation';

// (req: Request, res: Response) will come from express typeScript type declaration

// higher order function
//  this higher order function will reduce the code and there is no no need to use try catch
const catchAsync = (fn: RequestHandler) => {
  // returning inside a function means when the route is hit then catchAsync gets the function and returns a handler function.
  // if we do not return inside a function it will represent that it will return the output after calling the async handler but we need the handler function
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

//  we do not need to use Request Handler here since it will be handled inside the catchAsync
const getSingleStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Student is retrieved Successfully',
    data: result,
  });
});

const getAllStudents = catchAsync(async (req, res, next) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student are retrieved Successfully',
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Student deleted Successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
