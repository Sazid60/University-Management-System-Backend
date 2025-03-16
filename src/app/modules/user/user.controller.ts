import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    // const zodParseData = studentValidationSchema.parse(studentData);

    //  will call service function to send this data
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    //  send response
    // res.status(200).json({
    //   success: true,
    //   message: 'Student is Created Successfully',
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is Created Successfully',
      data: result,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: error.message || 'Something Went Wrong',
    //   error: error,
    // });
    next(error);
  }
};

export const UserController = {
  createStudent,
};
