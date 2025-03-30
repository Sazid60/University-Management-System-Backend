import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';

// zod error handler
const handleZodError = (err: ZodError) => {
  // handler organize the errors structure

  // making error source since we are not sending the zod error directly
  // we ar doing map since multiple issue can come
  const errorSource: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      //we are doing this since last index of path object shows the exact path
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};

export default handleZodError;
