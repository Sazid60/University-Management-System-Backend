import status from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

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

  //  create environment for isolated environment
  const session = await mongoose.startSession();

  // since we have to catch error while happening transaction we will use try catch
  try {
    // start Transaction
    session.startTransaction();
    //  set generated Id
    userData.id = await generateStudentId(admissionSemester);

    // __________Transaction 1
    //  create a user
    const newUser = await User.create([userData], { session });
    // we will give the data as array since it should be received as an array in transaction, inside the array in index 0 we will get the data. the array contains array of object

    // this will make the take the response and make an array with response object
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Create User');
    }
    // ste id,  _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference id

    // __________Transaction 2 create student
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Create Student');
    }

    // we will do commit to save permanently
    await session.commitTransaction();

    //  now end session
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    // throw new AppError(status.BAD_REQUEST, 'Filed To Delete Student');
    throw err;
    // For transaction rollback we should use this to get the best error
  }
};

export const UserServices = {
  createStudentIntoDB,
};
