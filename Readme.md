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
