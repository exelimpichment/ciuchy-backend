import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Response } from 'express';

export interface ITokenUser {
  name: string;
  userId: Types.ObjectId;
  role: 'admin' | 'user';
}
export interface IVerifyResponse {
  name: string;
  userId: string;
  role: string;
  refreshToken?: string;
}

interface IRefreshTokenPayload {
  userForTokenization: ITokenUser;
  refreshToken: string;
}

export const createJWT = ({
  payload,
}: {
  payload: ITokenUser | IRefreshTokenPayload;
}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export const attachCookiesToResponse = ({
  res,
  userForTokenization,
  refreshToken,
}: {
  res: Response;
  refreshToken: string;
  userForTokenization: ITokenUser;
}) => {
  const accessTokenJWT = createJWT({ payload: userForTokenization });
  const refreshTokenJWT = createJWT({
    payload: { userForTokenization, refreshToken },
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneMonth),
  });
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as ITokenUser &
    IRefreshTokenPayload;
};
