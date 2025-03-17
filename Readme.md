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
