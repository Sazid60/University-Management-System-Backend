import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculties are retrieved Successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty retrieved Successfully',
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const facultyExists = await Faculty.isUserExist(id);
  // console.log(studentExists)
  if (facultyExists === null) {
    throw new AppError(status.NOT_FOUND, 'Faculty not found');
  }
  const result = await FacultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty Deleted Successfully',
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;

  const facultyExists = await Faculty.isUserExist(id);
  // console.log(studentExists)
  if (facultyExists === null) {
    throw new AppError(status.NOT_FOUND, 'Faculty not found');
  }

  const result = await FacultyServices.updateFacultyIntoDB(id, faculty);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Faculty is updated successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
