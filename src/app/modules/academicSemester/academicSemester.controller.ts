import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  //  will call service function to send this data
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Semester is Created Successfully',
    data: result,
  });
});

//  get all academic semesters
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllSemesterFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Retrieved Academic Semesters Successfully',
    data: result,
  });
});
// get single semester
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleSemesterFromDB(semesterId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Retrieved Academic Semester Successfully',
    data: result,
  });
});

const updateSemester = catchAsync(async (req, res) => {
  //  will call service function to send this data
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Academic Semester is Updated Successfully',
    data: result,
  });
});

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSemester,
};
