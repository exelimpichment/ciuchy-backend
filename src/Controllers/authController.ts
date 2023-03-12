//! this can be implemented using classes with static methods
//! but I decided to use functional programming here
//! since I find this method more widely used across the internet
import { Request, Response } from 'express';
import User from '../Models/User';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
// import * as CustomError from '../errors';

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  // destructured to be sure what i am passing to _create_

  const isUniqueEmail = await User.findOne({ email });
  if (isUniqueEmail) {
    throw new BadRequestError('email already exists');
  }

  const user = await User.create({ email, name, password });
  res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req: Request, res: Response) => {
  res.send('login');
};

export const logout = async (req: Request, res: Response) => {
  res.send('logout');
};
