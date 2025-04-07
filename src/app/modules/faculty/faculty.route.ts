import express from 'express';
import { FacultyControllers } from './faculty.controller';
const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);
router.get('/:id', FacultyControllers.getSingleFaculty);
router.delete('/:id', FacultyControllers.deleteFaculty);
router.patch('/:id', FacultyControllers.updateFaculty);

export const FacultyRoutes = router;
