import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  // __________using custom static method

  if (await Student.isUserExist(studentData.id)) {
    throw new Error('User already Exist');
  }
  const result = await Student.create(studentData); //builtin static method
  // ________________________________________

  // ________________using custom instance method
  // using custom instance method
  // const student = new Student(studentData);
  // // using custom instance method
  // if (await student.isUserExist(studentData.id)) {
  //   throw new Error('User already Exist');
  // }

  // const result = await student.save(); // Built in instance method
  // _____________________________________________

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
