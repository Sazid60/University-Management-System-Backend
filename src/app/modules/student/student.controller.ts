import { StudentServices } from './student.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from './student.validation';

// (req: Request, res: Response) will come from express typeScript type declaration

//  we do not need to use Request Handler here since it will be handled inside the catchAsync
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Student is retrieved Successfully',
    data: result,
  });
});

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student are retrieved Successfully',
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req, res) => {
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
