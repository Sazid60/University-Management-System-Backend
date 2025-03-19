import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //  semester Name --> semester code

  // (academicSemesterNameCodeMapper['Fall']!== payload.code)
  // academicSemesterNameCodeMapper['Fall']=03 this will come from mapper
  // this wo=ill come from my payload payload.code = "01"
  // (academicSemesterNameCodeMapper['Fall']!== 01)
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

//  get all academic semester from db
const getAllSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};
//  get all academic semester from db
const getSingleSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemester.findById({ _id: semesterId });
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
