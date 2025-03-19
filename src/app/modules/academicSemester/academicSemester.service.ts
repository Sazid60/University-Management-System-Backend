import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //  semester Name --> semester code

  // type TAcademicSemesterCodeMapper = {
  //   Autumn: '01',
  //   Summer: '02',
  //   Fall: '03',
  // }

  //  we can use dynamically mapped type
  //  this is used so that if further other semester added it automatically or dynamically gets the value
  type TAcademicSemesterCodeMapper = {
    [key: string]: string;
  };
  const academicSemesterNameCodeMapper: TAcademicSemesterCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  };
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

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
