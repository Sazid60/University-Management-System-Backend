import mongoose from 'mongoose';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { TFaculty } from './faculty.interface';
import { FacultySearchableFields } from './faculty.constants';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment'),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id }).populate('academicDepartment');
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

// // The function updateFacultyIntoDB takes in two parameters:
// // - `id` is a string representing the unique identifier of the faculty to be updated
// // - `payload` is a partial object of type TFaculty, containing the data to update in the database

// const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
//   // Extracting the `name` property from the payload and storing the remaining properties in `remainingFacultyData`

//   const { name, ...remainingFacultyData } = payload;

//   // Creating an empty object to hold the modified update data.
//   // This object will hold the key-value pairs to be updated in the database.
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...remainingFacultyData, // Spread the remaining properties of the faculty into modifiedUpdatedData
//   };

//   // Check if the `name` property exists and contains any keys
//   if (name && Object.keys(name).length) {
//     // Loop through each key-value pair in the `name` object
//     for (const [key, value] of Object.entries(name)) {
//       // For each key in the `name` object, add it to modifiedUpdatedData
//       // The key in the modifiedUpdatedData is prefixed with "name." to represent nested properties (e.g., name.firstName)
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }

//   // At this point, the `modifiedUpdatedData` object is prepared with all the necessary update data
//   // You can now proceed to update the faculty record in the database using the `id` and the `modifiedUpdatedData`
//   const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  // console.log(id);
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  // console.log(result);
  return result;
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  deleteFacultyFromDB,
  updateFacultyIntoDB,
};
