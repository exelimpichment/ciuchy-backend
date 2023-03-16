//! this can be implemented using classes with static methods
//! but I decided to use functional programming here
//! since I find this method more widely used across the internet
import { Request, Response } from 'express';
import { User } from '../Models/User';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import UnauthenticatedError from '../errors/unauthenticated';
import * as CustomError from '../errors';
import createTokenUser from '../utils/createTokenUser';
import {
  // isTokenValid
  attachCookiesToResponse,
} from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  // destructured to be sure what i am passing to _create_

  const isUniqueEmail = await User.findOne({ email });
  if (isUniqueEmail) {
    throw new CustomError.BadRequestError('email already exists');
  }

  const user = await User.create({ email, name, password });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'logout' });
};
