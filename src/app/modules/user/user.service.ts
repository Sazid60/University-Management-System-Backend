import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object

  const userData: Partial<TUser> = {};

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

  //  manually generate id for now
  userData.id = '2030100001';
  //  create a user
  const newUser = await User.create(userData);

  // this will make the take the response and make an array with response object
  if (Object.keys(newUser).length) {
    // ste id,  _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference id
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
