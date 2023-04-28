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

interface IErrorMessageItem {
  [key: string]: string | object | undefined | boolean;
  properties: {
    message: string;
  };
}
// <IErrorMessageItem>
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

  if (err.name === 'ValidationError') {
    console.log(err.errors);

    customError.msg = Object.values<IErrorMessageItem>(err.errors)
      .map((item) => item.message)
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
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
