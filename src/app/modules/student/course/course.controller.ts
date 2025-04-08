import status from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import { CourseServices } from './course.services';
import sendResponse from '../../../utils/sendResponse';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course are retrieved successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourse,
  getAllCourses,
  deleteCourse,
};
