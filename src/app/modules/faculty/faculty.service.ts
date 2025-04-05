import { Faculty } from './faculty.model';

const getAllFacultiesFromDB = async () => {
  const result = Faculty.find();
  return result;
};

export const FacultyServices = {
  getAllFacultiesFromDB,
};
