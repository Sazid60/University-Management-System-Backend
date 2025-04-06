import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are retrieved Successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty retrieved Successfully',
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty Deleted Successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
};
