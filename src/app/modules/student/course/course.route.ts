import validateRequest from '../../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import {
  CourseValidations,
  facultiesWithCourseValidationSchema,
} from './course.validation';
import express from 'express';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

router.get('/', CourseControllers.getAllCourses);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
