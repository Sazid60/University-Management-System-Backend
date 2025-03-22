const createAcademicDepartmentIntoDB = async (payload: TAcademicFaculty) => {
  const result = await .create(payload);
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
};
