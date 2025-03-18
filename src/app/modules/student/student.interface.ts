import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  isDeleted: boolean;
};

// ______________________________For custom instance method

//  declaring function types
// This defines a type (StudentMethods) that contains a function called isUserExist.
// The function:
// Takes an ID (string).
// Returns a Promise that resolves to either a TStudent object or null.

//  this is A FUNCTION TYPE
// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>;
// };

// Create a new Model type that knows about StudentMethods
// type UserModel = Model<IUser, {}, IUserMethods>; *** example
// Record<string, never> means an object type where keys are string, but values can never exist
// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
// ____________________________________________________________________

// for custom static___________________________________________________

export interface StudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>;
}
