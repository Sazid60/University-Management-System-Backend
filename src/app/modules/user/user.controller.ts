import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  //  will call service function to send this data
  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student is Created Successfully',
    data: result,
  });
});

// create Faculty

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is Created Successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});
export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
};
