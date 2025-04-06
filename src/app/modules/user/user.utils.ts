import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  // we will use lean when once doing the query we will not do any operation of mongoose

  // 0001
  // return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
  // 2030 01 0001
  return lastStudent?.id ? lastStudent.id : undefined;
};

// year semesterCode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); // by default 0000

  const lastStudentId = await findLastStudentId();
  if (lastStudentId) {
    // 2030 01 0001
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6); //01
    const lastStudentYear = lastStudentId?.substring(0, 4); //2030

    const currentSemesterCode = payload.code;
    const currentYear = payload.year;

    if (
      lastStudentId &&
      lastStudentSemesterCode === currentSemesterCode &&
      lastStudentYear === currentYear
    ) {
      currentId = lastStudentId.substring(6);
    }
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// find Last Faculty

const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  // Start with default ID string '0' in case there's no previous faculty ID
  let currentId = (0).toString(); // currentId = "0"

  // Get the last saved faculty ID from the database (e.g., "F-0007")
  const lastFacultyId = await findLastFacultyId(); // e.g., lastFacultyId = "F-0007"

  // If a lastFacultyId exists, extract the numeric part after "F-"
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2); // currentId = "0007"
  }

  // Convert to number, increment by 1, and pad with zeros to keep 4 digits
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  // Number("0007") + 1 = 8 → "8".padStart(4, '0') = "0008"

  // Add prefix "F-" to match the ID format
  incrementId = `F-${incrementId}`; // incrementId = "F-0008"

  // Return the final generated faculty ID
  return incrementId; // returns: "F-0008"
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};
