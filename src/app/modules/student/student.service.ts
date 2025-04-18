import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // console.log('base Query', query);
  // const queryObj = { ...query }; // we want to delete so we are making a copy so that i do not permanently deleted as we might need it in future
  // {email : {$regex: query.searchTerm,$options:i}}
  // {presentAddress : {$regex: query.searchTerm,$options:i}}
  // {'name.firstName' : {$regex: query.searchTerm,$options:i}}
  // These Fields will be dynamic should not be hardcoded since it could be any field. so we have to do mapping
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // }); // we are not keeping await here since we will do chaining

  // // Filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // // since searchTerm value is replaced and trying to do exact match in searchTerm. so we are excluding
  // excludeFields.forEach((el) => delete queryObj[el]);
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);
  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // field Limiting

  // query: { fields: 'name, email' } we have to make it 'name email '
  //   let fields = '-__v';
  //   if (query.fields) {
  //     fields = (query.fields as string).split(',').join(' ');
  //     console.log({ fields });
  //   }
  //   const filedQuery = await limitQuery.select(fields);
  //   return filedQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.findById(id)
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

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, 'Failed To Delete Student');
    }
    const userId = deletedStudent.user;

    const deletedUser = await User.findOneAndUpdate(
      userId,
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
    throw new AppError(status.BAD_REQUEST, 'Filed To Delete');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  updateStudentIntoDB,
};
