import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Response } from 'express';

export interface ITokenUser {
  name: string;
  userId: Types.ObjectId;
  role: 'admin' | 'user';
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
    // if secure = true -> https will be used
    // it is possible to use https only in production
    // we check if we are in production below
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

// i had the following error here:
// Argument of type 'string | undefined' is not assignable to parameter of type 'Secret | GetPublicKeyOrSecret'.
// found solution:
// https://stackoverflow.com/questions/66328425/jwt-argument-of-type-string-undefined-is-not-assignable-to-parameter-of-typ

export const isTokenValid = ({ token }: { token: string }) => {
  jwt.verify(token, process.env.JWT_SECRET as string);
};
