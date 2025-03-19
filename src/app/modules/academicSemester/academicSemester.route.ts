import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
} from './academicSemester.validation';
const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(createAcademicSemesterValidationSchema),
  AcademicSemesterController.createAcademicSemester,
);
router.get(
  '/get-all-academic-semesters',
  AcademicSemesterController.getAllAcademicSemester,
);
router.get(
  '/:semesterId',
  AcademicSemesterController.getSingleAcademicSemester,
);
router.patch(
  '/:semesterId',
  validateRequest(updateAcademicSemesterValidationSchema),
  AcademicSemesterController.updateSemester,
);

export const AcademicSemesterRoutes = router;
