import { Schema, model } from 'mongoose';
import {
  TStudent,
  TUserName,
  TGuardian,
  TLocalGuardian,
  // StudentMethods,
} from './student.interface';
// import validator from 'validator';
import bcrypt from 'bcrypt';
import { StudentModel } from './student.interface';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 char'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);

    //     return firstNameStr === value;
    //     // if(value !== firstNameStr){
    //     //   return false
    //     // } return true
    //   },
    //   message: '{VALUE} Is Not Inj Capitalized Format',
    // },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    trim: true,
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} Is not valid',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation Is Required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father  Contact No Required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation Is Required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother  Contact No Required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name Required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation Required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No Required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address Required'],
  },
});

// if we use custom instance thod we have to write this or send these
// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>(

// if we use custom static method we just have to send studentModel since no method is created
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is Required'],
      unique: true,
      ref: 'User',
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      maxlength: [20, 'Password can not be more than 20 char'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is Required'],
    },
    //   this is predefined property so i will use enum
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} Is Not a Valid Input',
      },
      required: [true, 'Gender Is Required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email Required'],
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} Is not a valid email type',
      // },
    },
    contactNo: { type: String, required: [true, 'Contact No Required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact No Required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address Required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address Required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian Info Required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian Info Required'],
    },
    profileImg: { type: String, required: [true, 'Profile Image Required'] },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// _________________________________  middleware/hook (when we will do something on schema) this will work on create() or save() function
// Document Middleware
// Pre save middleware
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save the data');

  // hashing password and save into db
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // password field er data niye change kore abr password field e set kore dicci
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});
// Post save middleware
//Post Save Hook/Middleware
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  // console.log(this, 'post hook : we saved our the data');
  next();
});

// __________________________Query Middleware

studentSchema.pre('find', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } }); // this is chaining with find query
  // this is filtering data and then the actual find method is working with the filtered data
  next();
});

studentSchema.pre('findOne', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } }); // this is chaining with find query
  // this is filtering data and then the actual find method is working with the filtered data
  next();
});

//  stopping aggregate
// [ {$match: {isDeleted: {$ne:true}}},{ '$match': { id: 'STU00' } } ] that we need to do.

studentSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline()); //output : [ { '$match': { id: 'STU00' } } ]

  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// ____________________________________________________________

// ------------------------------Virtuals-------------------
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// ---------------------------------------------------------------

// ________custom  instance method___________
// (ADDING isUserExists Function as like adding a property inside an object)
// studentSchema.methods.isUserExist = async function (id: string) {
//   // const existingUser = await Student.findOne({ id:id });
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

// custom static method __________________
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
