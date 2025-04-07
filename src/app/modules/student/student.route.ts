import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();
// This will give us router object

// based on the router object we will do all crud operation

//  will call controller function
router.get('/', StudentControllers.getAllStudents);
router.get('/:id', StudentControllers.getSingleStudent);
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:id', StudentControllers.deleteSingleStudent);

export const StudentRoutes = router;
