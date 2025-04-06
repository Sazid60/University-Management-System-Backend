import express from 'express';
import { FacultyControllers } from './faculty.controller';
const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);
router.get('/:facultyId', FacultyControllers.getSingleFaculty);
router.delete('/:facultyId', FacultyControllers.deleteFaculty);
router.patch('/:facultyId', FacultyControllers.updateFaculty);

export const FacultyRoutes = router;
