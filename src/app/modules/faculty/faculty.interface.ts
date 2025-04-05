import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
export type TGender = 'male' | 'female' | 'other';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  designation: string;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// export interface FacultyModel extends Model<TFaculty> {
//   // eslint-disable-next-line no-unused-vars
//   isUserExists(id: string): Promise<TFaculty | null>;
// }

export interface FacultyModel extends Model<TFaculty> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: string): Promise<TFaculty | null>;
}
