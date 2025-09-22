//import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import status from 'http-status';

//const notFoundRoute = (req: Request, res: Response) => {
const notFoundRoute: RequestHandler = (req, res) => {
  return res.status(status.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
export default notFoundRoute;
