import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';

const app: Application = express();

//cors
app.use(cors({ origin: ['http://localhost:5173'] }));
//parsers
app.use(express.json());
app.use(cookieParser());

//application routes
//app.use('/api/v1/user', userRoutes);
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Bayazid!');

  //for detect UnhandledPromiseRejection
  //Promise.reject();
});

//if no matching route is found
app.use(notFoundRoute);

//global error handler
app.use(globalErrorHandler);

export default app;
