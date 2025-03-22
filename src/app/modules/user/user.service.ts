import status from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object

  const userData: Partial<TUser> = {};
  // Partial is used since empty object is added and the data will be assigned
  //  the assigned data are  //   password: //   role: //   id:

  // // if password is not given use default password
  // if (!password) {
  //   user.password = config.default_password as string;
  //   //  as we know the password will be definitely a string so we are setting the password as string
  // }else{
  //   user.password = password
  // }

  userData.password = password || (config.default_password as string);

  //  set student role
  userData.role = 'student';

  // Find Academic Semester info since we have object id
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(status.NOT_FOUND, 'Academic semester not found');
  }

  //  set generated Id
  userData.id = await generateStudentId(admissionSemester);

  //  create a user
  const newUser = await User.create(userData);

  // this will make the take the response and make an array with response object
  if (Object.keys(newUser).length) {
    // ste id,  _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference id
    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
