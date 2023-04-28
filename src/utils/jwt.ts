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
}

export const createJWT = ({ payload }: { payload: ITokenUser }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: ITokenUser;
}) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

export const isTokenValid = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as IVerifyResponse;
};
