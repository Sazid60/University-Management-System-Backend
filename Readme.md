# University Management System Part -4

GitHub Link:

https://github.com/Apollo-Level2-Web-Dev/Level2-Batch4-PH-University-Server/tree/part-4

### What we Will learn In This Module

- Error Handling
- Searching
- Filtering
- Pagination

## 14-1 What Is Error Handling

![alt text](<WhatsApp Image 2025-03-26 at 10.31.25_14304b33.jpg>)
This is The Error Handling We Are doing but as a developer we have to do error handling more precisely since we do not want application to be stopped by any error

### Types Of Errors

#### Operational Error (We can Handle it in express application)

- Errors that we can predict will happen in future
  1. Invalid User Input
  2. Failed to run server
  3. Failed to connect database
  4. Invalid auth token

#### Programmatic Error (We can Handle it in express application)

- Errors that developers produces when developing

  1. using undefined variables
  2. using properties that do not exist
  3. passing number instead of string
  4. using req.params instead of req.query

- Operational and Programmatic Error wll happen inside the application so these can be handles inside express application

#### Unhandled Rejection(Asynchronous code)

- When we Resolve Promise, sometimes some promises might be rejected, this is called unhandled rejection if we do not handled
- This can be inside or outside the express application

#### Uncaught Expectation (synchronous Code)

- This can be inside or outside the express application

## Know More About Errors

![alt text](<WhatsApp Image 2025-03-26 at 10.56.00_5e9f1e58.jpg>)

- Operational and Programmatic Error wll happen inside the application so these can be handles inside express application
- Unhandled Rejection(Asynchronous code),Unhandled Rejection(Asynchronous code) be inside or outside the express application
- Errors Can Come From Nay File
  ![alt text](<WhatsApp Image 2025-03-26 at 10.56.40_5d560b80.jpg>)

- There Might Be different types of pattern of different errors, like zos
- ZodError
  ![alt text](<WhatsApp Image 2025-03-26 at 11.00.22_6b7a24d4.jpg>)
- Mongoose Validation Error
  ![alt text](<WhatsApp Image 2025-03-26 at 11.01.16_240c610d.jpg>)
- Mongoose Cast Error
  ![alt text](<WhatsApp Image 2025-03-26 at 11.01.48_3aaf0a3e.jpg>)
- Mongoose Duplicate Error
  ![alt text](<WhatsApp Image 2025-03-26 at 11.02.13_2a858803.jpg>)

#### We can not send multiple pattern to frontend and this is not right

![alt text](<WhatsApp Image 2025-03-26 at 11.03.38_3eb81227.jpg>)

### We will handle all the errors using global Error Handler then we will make different error handler and make common pattern and send to frontend

![alt text](<WhatsApp Image 2025-03-26 at 11.06.26_16877fc8.jpg>)

- The Error Pattern Will be like this
  ![alt text](<WhatsApp Image 2025-03-26 at 11.08.41_22b3b9df.jpg>)
  ![alt text](<WhatsApp Image 2025-03-26 at 11.10.22_88c6c917.jpg>)
- We will not send the stack in production
  ![alt text](<WhatsApp Image 2025-03-26 at 11.10.54_de3e5025.jpg>)

## 14-2 Understanding Error Patterns in Zod and Mongoose

- we have to take care of all layer error handling even if we have handled in different layer
- we need consistence pattern of error

<!--
success:
message:
errorSources:[
path:'',
message:''
]
stack:''
 -->

- we can use ErrorRequestHandler

```ts
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
```

- updated

```ts
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {};
```

![alt text](image.png)

- Zod provides a subclass of Error called ZodError. ZodErrors contain an issues array containing detailed information about the validation problems.

- ZodError is a subclass of Error; you can create your own instance easily:
- To checking class, subclass or instance we have to use instanceof operator
