# University Management System Part -3

Part 3:

https://github.com/Apollo-Level2-Web-Dev/Level2-Batch4-PH-University-Server/tree/part-3

Requirement Analysis:

https://docs.google.com/document/d/10mkjS8boCQzW4xpsESyzwCCLJcM3hvLghyD_TeXPBx0/edit?usp=sharing

In Module 13,

We start by fixing previous bugs to ensure our code runs smoothly. We then create and validate the Academic Faculty interface and model, set up routes, controllers, and services, and test them using Postman. Next, we develop and validate the Academic Department interface and model, create controllers and routes, and test them with Postman. We handle validation for departments during creation and updates, learn to populate referencing fields, and implement the AppError class for better error management. We also explore transaction and rollback techniques, including deleting a student within a transaction. Finally, we learn how to dynamically update both primitive and non-primitive fields. This module helps you manage and validate complex data structures efficiently.

## Module Outcomes

1. Bug Fix
2. Academic Faculty CRUD
3. Academic Department CRUD
4. Transaction and Roll BACK
5. Custom AppError
6. Dynamic Update Primitive and Non Primitive Field
7. Faculty (CRUD)

![alt text](<WhatsApp Image 2025-03-20 at 11.04.42_5b58eda0.jpg>)
![alt text](<WhatsApp Image 2025-03-20 at 11.05.28_4a14faa3.jpg>)

- There was a problem with generating id
- when new semester enrolment or new year comes the id should come from 0001 again that means reset is done
  ![alt text](<WhatsApp Image 2025-03-20 at 11.09.19_de25e7d6.jpg>)

- Id generation Bug Fix

```ts
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

/**
 * Finds the last student ID from the database.
 * The student ID format: YYYYSSXXXX (Year + Semester Code + 4-digit Number)
 *
 * @returns {Promise<string | undefined>} - The last student ID or undefined if no student exists.
 */
const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    { role: 'student' }, // Filter to find only students
    { id: 1, _id: 0 }, // Select only the 'id' field, exclude '_id'
  )
    .sort({ createdAt: -1 }) // Sort by creation date in descending order (latest first)
    .lean(); // Use lean() for performance optimization (no Mongoose document overhead)

  return lastStudent?.id ? lastStudent.id : undefined;
};

/**
 * Generates a unique student ID based on the academic year and semester.
 * Format: YYYYSSXXXX (Year + Semester Code + 4-digit Incremental Number)
 *
 * @param {TAcademicSemester} payload - The academic semester details (year and semester code).
 * @returns {Promise<string>} - The newly generated student ID.
 */
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = '0000'; // Default starting ID when no student exists

  const lastStudentId = await findLastStudentId(); // Retrieve last student ID from DB
  if (lastStudentId) {
    // Extract semester code and year from last student ID
    const lastStudentSemesterCode = lastStudentId.substring(4, 6); // e.g., '01'
    const lastStudentYear = lastStudentId.substring(0, 4); // e.g., '2030'

    const currentSemesterCode = payload.code; // Current semester code
    const currentYear = payload.year; // Current year

    // If the last student ID belongs to the same year and semester, continue incrementing
    if (
      lastStudentSemesterCode === currentSemesterCode &&
      lastStudentYear === currentYear
    ) {
      currentId = lastStudentId.substring(6); // Extract the last 4-digit number
    }
  }

  // Increment the ID and pad with leading zeros to maintain 4-digit format
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  // Construct final student ID in format YYYYSSXXXX
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
```

### University Management Project Updates

Functional Requirements:

Authentication
Student
Students can log in and log out securely.
Students can update their password.
Faculty
Faculty can log in and log out securely.
Faculty can update their password.
Admin:
Admin can log in and log out securely.
Admin can update their password.

Profile Management:
Student
Students can manage and update their profile.
Students can update certain fields.
Faculty:
Faculty can manage and update their profile.
Faculty can update certain fields.
Admin:
Admin can manage and update their profile.
Admin can update certain fields.

Academic Process:
Student:
Students can enroll in offered courses for a specific semester.
Students can view their class schedule.
Students can see their grades.
Students can view notice boards and events.
Faculty:
Faculty can manage student grades.
Faculty can access student’s personal and academic information.
Admin:
Admin can manage multiple processes:
Semester.
Course.
Offered Course.
Section.
Room.
Building.

User Management:
Admin:
Admins can manage multiple accounts.
Admin can block/unblock users.
Admin can change user passwords.

Data Model

User:

\_id
id (generated)
password
needsPasswordChange
role
status
isDeleted
createdAt
updatedAt

Student:
\_id
id (generated)
name
gender
dateOfBirth
email
contactNo
emergencyContactNo
presentAddress
permanentAddress
guardian
localGuardian
profileImage
admissionSemester
isDeleted
createdAt
updatedAt

Faculty:
\_id
id (generated)
designation
name
gender
dateOfBirth
email
contactNo
emergencyContactNo
presentAddress
permanentAddress
profileImage
academicFaculty
academicDepartment
isDeleted
createdAt
updatedAt

Admin:
\_id
id (generated)
designation
name
gender
dateOfBirth
email
contactNo
emergencyContactNo
presentAddress
permanentAddress
profileImage
managementDepartment
isDeleted
createdAt
updatedAt

Academic Semester:

\_id
name
year
code
startMonth
endMonth
createdAt
updatedAt

Academic Faculty:
\_id
name
createdAt
updatedAt

Academic Department:
\_id
name
academicFaculty
createdAt
updatedAt

API Endpoints
User:

users/create-student (POST)
users/create-faculty (POST)
users/create-admin (POST)

Student:
students (GET)
students/:id (GET)
students/:id (PATCH)
students/:id (DELETE)
students/my-profile

Faculty:
faculties(GET)
faculties/:id (GET)
faculties/:id (PATCH)
faculties/:id (DELETE)
faculties/my-profile

Admin:
admins (GET)
admins /:id (GET)
admins /:id (PATCH)
admins /:id (DELETE)
admins /my-profile

Auth:

auth/login
auth/refresh-token
auth/change-password
auth/forgot-password
auth/reset-password

![alt text](image-1.png)

### Academic Faculty Interface, Model, controller, services and Validation Created normal way as before

- delete route is skipped since it will create violation in data consistency
- if indexing is not created we will create manually
  ![alt text](image-2.png)

#### Now on our work flow will be Service-Controller-Route

#### Academic Department is created in the same manner ads its like just recap

### Module 13-7 Handle Department Validation when creating and updating documents

    name: {
      type: String,
      required: true,
      unique: true,
    },

- here unique is not a validation so we have to handle edge case like check in database and confirm. Too much of doing this will make the app slow so we have to be concerned

- we can handle this in services

```ts
const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: payload.name,
  });

  if (isDepartmentExist) {
    throw new Error('This Department Is Already exist');
  }
  const result = await AcademicDepartment.create(payload);
  return result;
};
```

- It Can be Done In Model using static or pre middleware or instance method

```ts
academicDepartmentSchema.pre('save', async function (next) {
  // instead of AcademicDepartment We Can Use this.model.findOne() this works fin in js
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new Error('This Department Is Already exist');
  }

  next();
});
```

- We Have a serious issue with the update like if anything is deleted but update is hit it shows update successfully but data is nul;l since id is not found. The problem is message showing. This is showing since id is not found but other mechanism is working. we have to handle this using query middleware.

```ts
// preventing update message showing if id does not exist using query middleware

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  // console.log(query);

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    throw new Error('This Department Do Not exist');
  }
  next();
});
```

### 13-8 How to Populate referencing fields and Implement AppError

- when we are referencing a idf we do not understand what data is hold by the id. so we have to use populate method to get the dta hold by id

```ts
const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  // here .populate('schema er moddhe property er nam, no the model er nam')
  return result;
};
const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};
```

- Id We Have to do multiple populate bwe will use chaining

```ts
const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('academicDepartment')
    .populate('admissionSemester');
  return result;
};
```

- There is a problem we are not getting the populated academicFaculty since it is nested inside academicDepartment
- For nested things we will use nested populate

```ts
const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
```

- We have some problem with throw new Error('som error message')
- The problem is we can not send status code here as a result if error happens we are not getting the right status code since it only allows sending message
- To solve this we will extend the Error class and Extend and make a super class to take message and status code at a time

```ts
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// preventing update message showing if id does not exist using query middleware

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  // console.log(query);

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    throw new AppError(status.NOT_FOUND, 'This Department Do Not exist');
  }
  next();
});
```

## 13-9 Implement Transition & RollBack

- Bondhu taka dhar nise ami taka back cailam taka send korlo bkash e send hoilo na transaction failed hoilo ekei bole transaction and roll back

1. Transition:
   A transition in a database refers to the process of changing the state of the database from one consistent state to another. It occurs when a transaction executes operations like INSERT, UPDATE, DELETE, or any modification that alters data.

2. Rollback:
   A rollback is the process of undoing changes made by a transaction before it is committed. If an error occurs or a condition fails, the rollback restores the database to its previous consistent state.

![alt text](<WhatsApp Image 2025-03-22 at 21.55.10_969e95be.jpg>)
![alt text](<WhatsApp Image 2025-03-22 at 21.55.47_81dff1c3.jpg>)

![alt text](<WhatsApp Image 2025-03-22 at 21.56.43_70a7396b.jpg>)

![alt text](<WhatsApp Image 2025-03-22 at 21.57.29_d48933bc.jpg>)

![alt text](<WhatsApp Image 2025-03-22 at 21.57.29_b59fbbea.jpg>)

- Atomicity Means all the process are considered as atomic unit. either all the process are successful or all failure
  ![alt text](<WhatsApp Image 2025-03-22 at 21.57.52_bcaaec33.jpg>)

- Consistency Like the amount that should be cut from your account and added to sent account that means consistent calculation.
  ![alt text](<WhatsApp Image 2025-03-22 at 21.58.10_1e099d91.jpg>)

- Isolation means a lot of transaction my occur at a time. Each and every transaction wil be isolated and will not be affected by others.
  ![alt text](<WhatsApp Image 2025-03-22 at 21.58.24_14f04816.jpg>)

- Durability means after transaction it will be saved permanently
  ![alt text](<WhatsApp Image 2025-03-22 at 21.58.48_5a5c6756.jpg>)

#### When we will use transaction ?

![alt text](<WhatsApp Image 2025-03-22 at 22.12.23_53c2e86a.jpg>)

- when it is required to do two or more write operation in database at a time we have to use transaction
- While doing read operation we do not need this so transaction is not required

#### How Transaction works?

- to use transaction we need an environment named startSession() of mongoose

  ![alt text](<WhatsApp Image 2025-03-22 at 22.20.01_34486070.jpg>)
  ![alt text](<WhatsApp Image 2025-03-22 at 22.24.17_13e30cbd.jpg>)
  ![alt text](<WhatsApp Image 2025-03-22 at 22.24.48_f30e9868.jpg>)
  ![alt text](<WhatsApp Image 2025-03-22 at 22.25.15_144ea282.jpg>)
  ![alt text](<WhatsApp Image 2025-03-22 at 22.25.41_e4ee5843.jpg>)

- If Fails we will use abortTransaction(). That means if failed it will not write in user of student collected that means rollback will happen
  ![alt text](<WhatsApp Image 2025-03-22 at 22.26.04_f7fcad1c.jpg>)
- If Fails we will end the session as well
  ![alt text](<WhatsApp Image 2025-03-22 at 22.29.32_ba19a96b.jpg>)

#### So The Overall process summary is

![alt text](<WhatsApp Image 2025-03-22 at 22.30.50_8d1bf570.jpg>)

```ts
//  create environment for isolated environment
const session = await mongoose.startSession();

// since we have to catch error while happening transaction we will use try catch
try {
  // start Transaction
  session.startTransaction();
  //  set generated Id
  userData.id = await generateStudentId(admissionSemester);

  // __________Transaction 1
  //  create a user
  const newUser = await User.create([userData], { session });
  // we will give the data as array since it should be received as an array in transaction, inside the array in index 0 we will get the data. the array contains array of object

  // this will make the take the response and make an array with response object
  if (!newUser.length) {
    throw new AppError(status.BAD_REQUEST, 'Failed To Create User');
  }
  // ste id,  _id as user
  payload.id = newUser[0].id;
  payload.user = newUser[0]._id; // reference id

  // __________Transaction 2 create student
  const newStudent = await Student.create([payload], { session });
  if (!newStudent.length) {
    throw new AppError(status.BAD_REQUEST, 'Failed To Create Student');
  }

  // we will do commit to save permanently
  await session.commitTransaction();

  //  now end session
  await session.endSession();

  return newStudent;
} catch (err) {
  await session.abortTransaction();
  await session.endSession();
}
```

### Transactions and Rollbacks (Simple Explanation)

#### What is a Transaction?

A transaction is like a small task or a set of steps that need to be done together to complete a job. If one step fails, the whole task fails. Think of it as a **"do everything or do nothing"** rule.

#### Example:

You want to transfer money:

1. Take money out of your account.
2. Put the money into your friend's account.

Both steps must happen together. If one step fails (like the second step), the first step is canceled too.

---

#### What is a Rollback?

A rollback means **undoing changes** if something goes wrong during the transaction. It makes sure everything goes back to how it was before the transaction started.

#### Example:

If the money is taken out of your account but doesn’t reach your friend’s account due to an error, the rollback will put the money back into your account.

---

#### Simple Idea:

- A **transaction** is a promise: “Do all the steps or none at all.”
- A **rollback** is the safety net: “If something breaks, fix everything by undoing changes.”

#### 4 principles of transaction Rollback

1. **Atomicity**: The entire transaction happens completely, or nothing happens at all.
2. **Consistency**: Ensures the database moves from one valid state to another, maintaining all rules and constraints.
3. **Isolation**: Transactions run independently without affecting each other, even if they are executed simultaneously.
4. **Durability**: Once a transaction is completed, its changes are permanent, even if the system crashes.

#### When We Will Use Transaction?

- Two or More database write operation
- We are writing in user and student collection at a time
- To use transition rollback we can use startSession() of mongoose
- startSession() will give isolated environment
- We have to use startSession() to start the session If all the process is successful we have to use commitTransaction() and endSession()
- If Fails we have to use abortTransaction() endSession()

```ts
import mongoose from 'mongoose';
import config from '../../config';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';

import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentInDB = async (payload: TStudent, password: string) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given use default password
  //   if (!password) {
  //     user.password = config.default_password as string;
  //   } else {
  //     user.password = password;
  //   }
  userData.password = password || (config.default_password as string);

  //   console.log('password:', password);
  // console.log(studentData);

  // set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('There Is No Admission Semester');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateStudentId(admissionSemester);
    //    create a user (transaction-1)
    //  we have to give data for transaction as array previously it is array
    const newUser = await User.create([userData], { session });

    //    create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create User', '');
    }
    //  set id, _id as user
    payload.id = newUser[0].id; //embedding id
    payload.user = newUser[0]._id; //reference _d

    // as in 0 index the new user data will exists

    //    create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed To Create Student',
        '',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};

export const UserServices = {
  createStudentInDB,
};
```

## 13-10 Delete student using transaction & rollback

```ts
// delete single student from db
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed To Delete Student',
        '',
      );
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete User', '');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
  }
};
```
