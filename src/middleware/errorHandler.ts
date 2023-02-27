import { Request, Response } from 'express';
import { CustomAPIError } from '../errors/customError';

// got it from here:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/507e9d3c8e48b2db81d3e071d270a2a297eed151/types/express-serve-static-core/index.d.ts#L32

type NextFunction = {
  (err?: any): void;
};

type ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  //* we have to check if some error is instance of CustomAPIError
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: 'Something went wrong' });
};
