import mongoose from 'mongoose';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';

const getAllFacultiesFromDB = async () => {
  const result = await Faculty.find();
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id });
  return result;
};
const deleteFacultyFromDB = async (id: string) => {
  console.log(id);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Delete Faculty');
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
    return deletedFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  deleteFacultyFromDB,
};
