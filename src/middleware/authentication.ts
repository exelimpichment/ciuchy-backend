import * as CustomErr from '../errors';
import { Request, Response } from 'express';
import { isTokenValid } from '../utils/jwt';
import { Token } from '../Models/Token';
import { attachCookiesToResponse } from '../utils/jwt';

type NextFunction = {
  (err?: any): void;
};

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    accessToken,
    refreshToken,
  }: { accessToken: string; refreshToken: string } = req.signedCookies;

  try {
    if (accessToken) {
      const { name, userId, role } = isTokenValid(accessToken);

      req.user = {
        name,
        userId,
        role,
      };
      return next();
    }

    const refreshTokenPayload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: refreshTokenPayload.userForTokenization.userId,
      refreshToken: refreshTokenPayload.refreshToken,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new CustomErr.UnauthenticatedError('Authentication failed');
    }

    attachCookiesToResponse({
      res,
      userForTokenization: refreshTokenPayload.userForTokenization,
      refreshToken: existingToken.refreshToken,
    });

    req.user = refreshTokenPayload.userForTokenization;
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError('Authentication failed');
  }
};

export default authenticateUser;
