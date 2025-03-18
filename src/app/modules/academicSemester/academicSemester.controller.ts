import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body;

  //  will call service function to send this data
  //   const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Semester is Created Successfully',
    data: result,
  });
});

export const AcademicSemesterController = {
  createAcademicSemester,
};
