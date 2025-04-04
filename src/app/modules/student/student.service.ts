import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  //  we will septate the non-primitive fields from the payload
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  //  too keep the transformed data we need an object
  // This ensures that modifiedData gets all the properties of remainingStudentData, but as a new object.
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
  - we will send this 
          "guardian" : {
            "fatherOccupation": "Kod becha"
        }

  - will be transformed to 
        "guardian.fatherOccupation": "Kodu Becha"
        using backend

        // the data will be like 
        name.firstName = "Mezba",
        name.LastName = "Sazid",
        //  we have to arrange inside the for look like key value pairs
   */
  // we will do transform using for loop
  //  Before loop we have to look for the data if its available or not
  if (name && Object.keys(name).length) {
    //  by Object.Keys we are checking the properties. That means we are converting object to an array and checking using length
    for (const [key, value] of Object.entries(name)) {
      // console.log(Object.entries(name));
      // Output: [['first', 'John'], ['last', 'Doe']]
      modifiedUpdatedData[`name.${key}`] = value;

      // { guardian: { fatherOccupation: 'Kod becha' } } we are getting this into payload
      // { 'guardian.fatherOccupation': 'Kod becha' } we are converting to this inside for loop
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Delete Student');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Delete User');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, 'Filed To Create Student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  updateStudentIntoDB,
};
