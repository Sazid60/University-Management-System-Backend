import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicFacultyServices } from './academicFaculty.services';
import sendResponse from '../../utils/sendResponse';

const createAcademicFaculty = catchAsync(async (req, res) => {
  //  will call service function to send this data
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Faculty is Created Successfully',
    data: result,
  });
});

//  get all academic semesters
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Retrieved Academic Faculty Successfully',
    data: result,
  });
});
// get single semester
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Retrieved Academic Faculty Successfully',
    data: result,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  //  will call service function to send this data
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    facultyId,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Faculty is Updated Successfully',
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicSemester,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
