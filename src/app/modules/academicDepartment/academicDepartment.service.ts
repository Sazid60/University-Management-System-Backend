import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  // const isDepartmentExist = await AcademicDepartment.findOne({
  //   name: payload.name,
  // });

  // if (isDepartmentExist) {
  //   throw new Error('This Department Is Already exist');
  // }
  // It Can be Done In Model using static or pre middleware or instance method
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  // here .populate('schemar moddhe property er nam, no the model er nam')
  return result;
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  updateAcademicDepartmentIntoDB,
  getSingleAcademicDepartmentFromDB,
  getAllAcademicDepartmentsFromDB,
};
