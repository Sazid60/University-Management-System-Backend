import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
// This will give us router object

// based on the router object we will do all crud operation

//  will call controller function
router.post('/create-student', StudentControllers.createStudent);
router.get('/', StudentControllers.getAllStudents);
router.get('/:studentId', StudentControllers.getSingleStudent);

router.delete('/:studentId', StudentControllers.deleteSingleStudent);

export const StudentRoutes = router;
