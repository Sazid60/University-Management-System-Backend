import { Faculty } from './faculty.model';

const getAllFacultiesFromDB = async () => {
  const result = await Faculty.find();
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id });
  return result;
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
};
