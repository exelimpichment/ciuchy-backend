import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface ITokenUser {
  name: string;
  userId: Types.ObjectId;
  role: 'admin' | 'user';
}

export const createJWT = (payload: ITokenUser) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = ({ token }: { token: string }) => {
  jwt.verify(token, process.env.JWT_SECRET as string);
};

// i had the following error here:
// Argument of type 'string | undefined' is not assignable to parameter of type 'Secret | GetPublicKeyOrSecret'.
// found solution:
// https://stackoverflow.com/questions/66328425/jwt-argument-of-type-string-undefined-is-not-assignable-to-parameter-of-typ
