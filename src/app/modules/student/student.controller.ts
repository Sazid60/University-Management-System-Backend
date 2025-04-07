import { StudentServices } from './student.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
// import studentValidationSchema from './student.validation';

// (req: Request, res: Response) will come from express typeScript type declaration

//  we do not need to use Request Handler here since it will be handled inside the catchAsync
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Student is retrieved Successfully',
    data: result,
  });
});

const getAllStudents = catchAsync(async (req, res) => {
  console.log(req.query);
  const result = await StudentServices.getAllStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student are retrieved Successfully',
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const studentExists = await Student.isUserExist(id);
  // console.log(studentExists)
  if (studentExists === null) {
    throw new AppError(status.NOT_FOUND, 'Student not found');
  }
  const result = await StudentServices.deleteSingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student deleted Successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const studentExists = await Student.isUserExist(id);
  // console.log(studentExists)
  if (studentExists === null) {
    throw new AppError(status.NOT_FOUND, 'Student not found');
  }
  const result = await StudentServices.updateStudentIntoDB(id, student);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is Updated Successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent,
};
