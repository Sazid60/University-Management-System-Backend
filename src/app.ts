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

app.use(globalErrorHandler);

// not found route
// @ts-expect-error
app.use(notFound);
export default app;
