import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
