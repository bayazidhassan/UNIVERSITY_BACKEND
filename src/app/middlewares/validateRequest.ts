import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import catchAsync from '../utils/catchAsync';

/*
const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};
*/

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
