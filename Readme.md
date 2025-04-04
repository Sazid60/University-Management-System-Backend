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

## 14-3 How to Convert Zod Error

- Zod Error Pattern

```ts
 "err": {
        "issues": [
            {
                "code": "invalid_type",
                "expected": "string",
                "received": "undefined",
                "path": [
                    "body",
                    "name"
                ],
                "message": "Name Is Required"
            }
        ],
        "name": "ZodError"
    },
```

- First We Will Detect The Error and then using the handler we will modify the error according to us

[ZOD ERROR HANDLING](https://zod.dev/ERROR_HANDLINGhttps://zod.dev/ERROR_HANDLING)

- First we have to trace in which structure our error is coming and then we will organize our error handler based on that

![alt text](image.png)

- Zod provides a subclass of Error called ZodError. ZodErrors contain an issues array containing detailed information about the validation problems.

- ZodError is a subclass of Error; you can create your own instance easily:
- To checking class, subclass or instance we have to use instanceof operator
- Handling Zod Error

```ts
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  type TErrorSource = {
    path: string | number;
    message: string;
  }[];

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // zod error handler
  const handleZodError = (err: ZodError) => {
    // handler organize the errors structure

    // making error source since we are not sending the zod error directly
    // we ar doing map since multiple issue can come
    const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        //we are doing this since last index of path object shows the exact path
        message: issue.message,
      };
    });
    return {
      statusCode,
      message: 'Zod Validation Error',
      errorSource,
    };
  };
  // To checking class, subclass or instance we have to use instanceof operator
  //  we are detecting here that this is a zod error
  if (err instanceof ZodError) {
    // now we will send the error to the handler
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    //  now we will be doing over write
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
```

## 14-4 How To Convert Mongoose Validation Error

- Mongoose is The First validation layer and on top of mongoose Zod Validation is standing
- a Fewer error will go to mongoose because zod error will handle but still we have to handle

- Mongoose Error Pattern

```ts
   "err": {
        "errors": {
            "name": {
                "name": "ValidatorError",
                "message": "Path `name` is required.",
                "properties": {
                    "message": "Path `name` is required.",
                    "type": "required",
                    "path": "name"
                },
                "kind": "required",
                "path": "name"
            }
        },
        "_message": "AcademicDepartment validation failed",
        "name": "ValidationError",
        "message": "AcademicDepartment validation failed: name: Path `name` is required."
    },
```

- We Have to Manipulate this

- "name": "ValidationError", This will be used to detect the Mongoose Error. and we can access this by using err.name

- Mongoose Error Handler

```ts
import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSource: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Mongoose Validation Error',
    errorSource,
  };
};

export default handleValidationError;
```

- Final Global Error Handler

```ts
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // To checking class, subclass or instance we have to use instanceof operator
  //  we are detecting here that this is a zod error
  if (err instanceof ZodError) {
    // now we will send the error to the handler
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    //  now we will be doing over write
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'ValidationError') {
    // console.log('Ami Mongoose Validation Error');
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
```

## 14-5 How To Handle Cast Error And 11000 Error

- we should create a return type as well so that fixed type data is sent

```ts
import mongoose from 'mongoose';
import { TErrorSources } from '../interface/error';
type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSource: TErrorSources;
};

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSource: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Mongoose Validation Error',
    errorSource,
  };
};

export default handleValidationError;
```

- Cast Error means {{ph-local-url}}/academic-departments/67de60ac07446b2c38bf6bc3 in here when id is invalid it shows a cast error.
- Cast Error Pattern

```ts
"err": {
        "stringValue": "\"67de60ac07446b2c38bf6bcewe\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67de60ac07446b2c38bf6bcewe",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67de60ac07446b2c38bf6bcewe\" (type string) at path \"_id\" for model \"AcademicDepartment\""
    },
```

- Handling Cast Error

```ts
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSource: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid Id',
    errorSource,
  };
};

export default handleCastError;
```

- Global Error Handler Changes

```ts
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // To checking class, subclass or instance we have to use instanceof operator
  //  we are detecting here that this is a zod error
  if (err instanceof ZodError) {
    // now we will send the error to the handler
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    //  now we will be doing over write
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'ValidationError') {
    // console.log('Ami Mongoose Validation Error');
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    // err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
```

- We have to handled the duplicate id error, though we have used pre hook to handle the duplicate id, we have to handle the 11000 error for this
- If we have not handled using pre hook it would be handled by using unique:true, technically unique:true is not a validator, unique just does indexing and sends error

- Duplicate Error Format

```ts
"err": {
        "errorLabelSet": {},
        "errorResponse": {
            "index": 0,
            "code": 11000,
            "errmsg": "E11000 duplicate key error collection: first-project.academicdepartments index: name_1 dup key: { name: \"Department Of Computer Science and Engineering\" }",
            "keyPattern": {
                "name": 1
            },
            "keyValue": {
                "name": "Department Of Computer Science and Engineering"
            }
        },
        "index": 0,
        "code": 11000,
        "keyPattern": {
            "name": 1
        },
        "keyValue": {
            "name": "Department Of Computer Science and Engineering"
        }
    },
```

- we can handle Duplicate Error

```ts
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorSource: TErrorSources = [
    {
      path: '',
      message: extractedMessage,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: `${extractedMessage} Already Exist`,
    errorSource,
  };
};

export default handleDuplicateError;
```

- Final Global Error Handler

```ts
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // To checking class, subclass or instance we have to use instanceof operator
  //  we are detecting here that this is a zod error
  if (err instanceof ZodError) {
    // now we will send the error to the handler
    const simplifiedError = handleZodError(err);
    // console.log(simplifiedError);
    //  now we will be doing over write
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'ValidationError') {
    // console.log('Ami Mongoose Validation Error');
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
    // console.log('Ami Duplicate');
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    // err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
```
