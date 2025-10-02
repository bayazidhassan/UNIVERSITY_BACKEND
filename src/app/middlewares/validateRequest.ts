import { ZodObject, ZodRawShape } from 'zod';
import catchAsync from '../utils/catchAsync';

/*
const validateRequest = (schema: ZodObject<ZodRawShape>): RequestHandler => {
  //return async (req: Request, res: Response, next: NextFunction) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      //res.status(500).json({
      //success: false,
      //message: 'Zod validation error.',
      //error: (err as Error).message,
      //});
      next(err);
    }
  };
};
*/

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return catchAsync(async (req, res, next) => {
    //await schema.parseAsync(req.body);

    /*
    parseAsync only expects one argument: the data you want to validate.
    If your schema needs to validate a combination of body and cookies, you need to merge them first.
    Then your Zod schema should match the merged object structure.
    */
    await schema.parseAsync({ ...req.body, ...req.cookies });
    next();
  });
};

export default validateRequest;
