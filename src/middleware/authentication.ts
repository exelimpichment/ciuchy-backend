import * as CustomErr from '../errors';
// import { isTokenValid } from '../utils/jwt';
import { Request, Response } from 'express';
import { isTokenValid } from '../utils/jwt';
// import { IVerifyResponse } from '../utils/jwt';

type NextFunction = {
  (err?: any): void;
};

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.signedCookies.token;

  if (!token) {
    throw new CustomErr.UnauthenticatedError('Authentication failed');
  }

  try {
    const payload = isTokenValid({ token });
    const { name, role, userId } = payload;

    req.user = { name, role, userId };

    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError('Authentication failed');
  }
};

export default authenticateUser;
