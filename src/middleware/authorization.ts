import { Request, Response } from 'express';
import * as CustomError from '../errors';

type NextFunction = {
  (err?: any): void;
};

const authorizeUser = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user !== undefined) {
      if (!roles.includes(req.user?.role)) {
        throw new CustomError.UnauthorizedError(
          'Unauthorized to access this route'
        );
      }
      next();
    }
  };
};

export default authorizeUser;

// here we can set it to only one user or we can receive
//  user from a function that  wraps middleware

// const authorizeUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user !== undefined) {
//     if (req.user.role !== 'admin') {
//       throw new CustomError.UnauthorizedError(
//         'Unauthorized to access this route'
//       );
//     }
//   }

//   next();
// };
