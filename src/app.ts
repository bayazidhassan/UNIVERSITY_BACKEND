import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';

const app: Application = express();

//cors
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
//parsers
app.use(express.json());
app.use(cookieParser());

//application routes
//app.use('/api/v1/user', userRoutes);
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('University Backend server is running...!');

  //for detect UnhandledPromiseRejection
  //Promise.reject();
});

//if no matching route is found
app.use(notFoundRoute);

//global error handler
/*
Express comes with a built-in error handler that takes care of any errors
that might be encountered in the app. This default error-handling middleware
function is added at the end of the middleware function stack.
If you pass an error to next() and you do not handle it in a custom error handler,
it will be handled by the built-in error handler; the error will be written to the
client with the stack trace. The stack trace is not included in the production environment.
*/
app.use(globalErrorHandler);

export default app;
