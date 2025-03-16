import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
// import studentValidationSchema from './student.validation';

// (req: Request, res: Response) will come from express typeScript type declaration

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student are retrieved Successfully',
      data: result,
    });
    // res.status(200).json({
    //   success: true,
    //   message: 'Student are retrieved Successfully',
    //   data: result,
    // });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: error.message || 'Something Went Wrong',
    //   error: error,
    // });
    next(error);
  }
};
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Single Student is retrieved Successfully',
      data: result,
    });
    // res.status(200).json({
    //   success: true,
    //   message: 'Single Student are retrieved Successfully',
    //   data: result,
    // });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: error.message || 'Something Went Wrong',
    //   error: error,
    // });
    next(error);
  }
};

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteSingleStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Single Student deleted Successfully',
      data: result,
    });
    // res.status(200).json({
    //   success: true,
    //   message: 'Single Student deleted Successfully',
    //   data: result,
    // });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: error.message || 'Something Went Wrong',
    //   error: error,
    // });
    next(error);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
