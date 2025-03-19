# Building University Management System Part-2

GitHub Link:

https://github.com/Apollo-Level2-Web-Dev/Level2-Batch4-PH-University-Server/tree/part-2

Requirement Analysis:

https://docs.google.com/document/d/10mkjS8boCQzW4xpsESyzwCCLJcM3hvLghyD_TeXPBx0/edit?usp=sharing

In Module 12, we begin by learning to avoid repetitive try-catch blocks using the catchAsync utility for cleaner code. Next, we implement custom middleware, starting with Higher Order Middleware, followed by the validateRequest Middleware to ensure requests meet specified criteria. We then create an interface and a model for Academic Semesters, ensuring they are properly defined and structured. We'll develop validation, routes, and controllers for Academic Semesters, followed by implementing the corresponding service to handle business logic. Logical validation of Academic Semesters is also covered to maintain data integrity. Additionally, we extend the student interface and model to include admission semesters, along with the necessary validations. Finally, we implement and complete the GenerateStudentId() utility function, ensuring unique IDs for students. This module enhances your skills in creating robust, maintainable features for web applications

## 12-1 Avoid Repetition of Try-Catch , use catchAsync

![alt text](<WhatsApp Image 2025-03-17 at 11.27.15_6f9beb51.jpg>)

### Higher Order Function

- A Function That Takes a function, do some task and return a function

- This is used to keep the code base clean
- Reduces repetitive functions
- Here Typescript comes with a solution named as functional typescript

- Express gives a request handler to deal with it and helps typescript

```ts
const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
```

```ts
const getSingleStudent: RequestHandler = async (req, res, next) => {};
```

- instead of Using These we will use :RequestHandler from express

```ts
const createStudent: RequestHandler = async(req, res, next);
```

```ts
const createStudent: RequestHandler = async (req, res, next) => {};
```

- no need to define like req:Request

- Still the codes are repeating since we are using RequestResponse in each controller segment

#### Ending an Era of Try Catch byy Using Higher Order function

- this higher order function will reduce the code and there is no no need to use try catch

```ts
const catchAsync = (fn: RequestHandler) => {
  // returning inside a function means when the route is hit then catchAsync gets the function and returns a handler function.
  // if we do not return inside a function it will represent that it will return the output after calling the async handler but we need the handler function
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
//  we do not need to use Request Handler here since it will be handled inside the catchAsync
const getSingleStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Student is retrieved Successfully',
    data: result,
  });
});
```

\

### If we want to make the routing more organized and simpler we will create in separate route folder index.ts fin and the use it app.ts

app ->routes ->index.ts

```ts
import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
];

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoutes);

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
```

### Inside app.ts

-app.ts

```ts
/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application Routes
app.use('/api/v1/', router);

const test = (req: Request, res: Response) => {
  res.send('Connected');
};

app.get('/', test);

// @ts-expect-error
app.use(globalErrorHandler);

// not found route
// @ts-expect-error
app.use(notFound);

export default app;
```

\

### If we want to make the routing more organized and simpler we will create in separate route folder index.ts fin and the use it app.ts

app ->routes ->index.ts

```ts
import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
];

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoutes);

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
```

### Inside app.ts

-app.ts

```ts
/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application Routes
app.use('/api/v1/', router);

const test = (req: Request, res: Response) => {
  res.send('Connected');
};

app.get('/', test);

// @ts-expect-error
app.use(globalErrorHandler);

// not found route
// @ts-expect-error
app.use(notFound);

export default app;
```

## 12-2 Implement Your Army Middleware

- We will use the try catch catchAsync in utils folder
- We will make middleware of zod and use it. Its like we will make a higher order function in middleware and we will use.

#### Where will we use the zod middleware?

- Since controller will validate the data after the route is being called. So we will use it in between route and controller

![alt text](<WhatsApp Image 2025-03-17 at 13.40.42_1b1c28fd.jpg>)

![alt text](<WhatsApp Image 2025-03-17 at 13.42.25_a84db944.jpg>)

![alt text](<WhatsApp Image 2025-03-17 at 13.42.58_4cab3fbe.jpg>)

![alt text](<WhatsApp Image 2025-03-17 at 13.44.41_1b75346e.jpg>)

- we can use multiple middleware and will be between route and controller so that controller stays clean
- If Any Error Occurs It Will send to the Global error handler using next() function

![alt text](<WhatsApp Image 2025-03-17 at 13.49.19_d50f1701.jpg>)

#### Middleware concepts

```ts
const router = express.Router();

const senaBahini = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    console.log(`Ami Senabahini`);
    next();
  };
};
router.post('/create-student', senaBahini, UserController.createStudent);

export const userRoutes = router;
```

- we will get the data in the body we will validate data inside the middleware and we will return error from the middleware if any kind of error happens

## 12-3 Implement validateRequest Middleware

- making the middleware function higher order

```ts
import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//  this is made higher order function
const senaBahini = (name) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    console.log(`I am ${name} senabahini`);

    //   validation
    next();
  };
};

router.post(
  '/create-student',
  senaBahini('ValidateRequest'),
  UserController.createStudent,
);

export const userRoutes = router;
```

- we have to take care of the data how we are sending and how we are dealing

```ts
import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { AnyZodObject } from 'zod';
import { studentValidationSchema } from '../students/student.validation';

const router = express.Router();

//  this is made higher order function
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   validation using zod
      // if everything alright next()
      await schema.parseAsync({
        body: req.body,
        //    as it is kept inside a body zod must be kept inside a body
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

router.post(
  '/create-student',
  validateRequest(studentValidationSchema),
  UserController.createStudent,
);

export const userRoutes = router;
```

- zod needs change as well

```ts
export const studentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),

    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImg: z.string(),
    }),
  }),
});
```

- Though we will make separate middleware for this

## 12-4 Create Academic Semester Interface

- Pattern Of Id And Password
  ![alt text](<WhatsApp Image 2025-03-18 at 10.31.48_2cb9f842.jpg>)

- Server will handle the id not will be coming from client. and password is optional might come from client

### Academic Semester Data Model

Academic Semester:

\_id
name
year
code
startMonth
endMonth
createdAt
updatedAt
![alt text](image.png)

## Academic Semester Creation

- academicSemester.interface.ts

```ts
export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: Date;
  startMonth: TMonths;
  endMonth: TMonths;
};
```

- academicSemester.constant.ts

```ts
import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
} from './academicSemester.interface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];
```

- Constants Are Kept separate so that it can be used in validation and model. i mean it can be used in different files

- academicSemester.model.ts

```ts
import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    year: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
```

- academicSemester.validation.ts

```ts
import { z } from 'zod';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
    // Validates the `name` field to be one of the predefined semester names.
    // Since `AcademicSemesterName` is imported as an array, we use the spread operator (`...`)
    // and cast it to `[string, ...string[]]` to ensure TypeScript infers it as a tuple.
    year: z.date(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]]),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterValidationSchema,
};
```

- Controller routes are made same way

## 12-8 Handle Logical Validation of Academic Semester

- same year same semester can not be created again we have to take in our mind
- unique true will not allow to create that academic semester again this is a problem
- So we will find in academic semester and check if the semester is created or not if exist we will throw error
- But The Best solution is to use (pre hook) middleware in the model

// Name Year
//2030 Autumn => Created
// 2031 Autumn
//2030 Autumn => XXX
//2030 Fall => Created

```ts
academicSemesterSchema.pre('save', async function (next) {
  // this next is mongoose's next
  const isSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExist) {
    throw new Error('Semester Is Already exist');
  }
  next();
});
```

- There is another problem is that mismatched semester code is being added to the with the semester name. we have to keep it aligned

- As This is related to business logic we will keep it into the service.ts
- We need a mapper for doing this
- semester Name --> semester code
- Mapper is nothing but object
  // Autumn 01
  // Summer 02
  // Fall 03

```ts
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
```

## 12-9 Add admission semester to student interface , model and validation

![alt text](<WhatsApp Image 2025-03-19 at 11.14.11_9cac0ef6.jpg>)

### Now For Generating Id For The student

![alt text](<WhatsApp Image 2025-03-19 at 13.44.39_60800d29.jpg>)

- when admitting first student id database the id will be 0000 +1 = 0001
- The student who have admitted last we have to find out to add further students id like 0001 + 1 = 0002
- we can find the last student id using mongoose createdAt: -1 property

- This padStart means how many digits it want

```ts
const currentId = (0).toString().padStart(4, '0');
```

- creating a dynamic incremental id

```ts
// auto generate id

import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

// -->year->semester->4 digit number
export const generateStudentId = (payload: TAcademicSemester) => {
  const currentId = (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
```

- still there is some bug. to get latest student id id we can use createdAt:-1 and lean

```ts
// auto generate id

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
  // here lean mean it will give pure javascript which will make faster. but we can not use it all time time, when we are using query and doing no other mongoose operation we can use lean()

  //   203001 (0001) this will be incremented
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
  //   substring(6) means it will cut down 6 digits
};

// -->year->semester->4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  //   console.log(await findLastStudentId());
  const currentId = (await findLastStudentId()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
```
