import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAcademicSemesterValidationSchema } from './academicSemester.validation';
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

export const AcademicSemesterRoutes = router;
