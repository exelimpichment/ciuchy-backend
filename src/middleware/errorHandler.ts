import { Request, Response } from 'express';
// import { CustomAPIError } from '../errors/customError';
import { StatusCodes } from 'http-status-codes';

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
  let customError = {
    // will set default here
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };
  //  we have to check if some error is instance of CustomAPIError
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  //^  we can comment this out since we have customError
  //^  where we check for code and msg

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      //!remove any and set a proper type
      .join(',');
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please chose another value`;
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }); // < == comment this in later to see real error msgs
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
