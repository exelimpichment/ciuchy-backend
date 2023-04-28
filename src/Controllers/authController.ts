//! this can be implemented using classes with static methods
//! but I decided to use functional programming here
//! since I find this method more widely used
import { Request, Response } from 'express';
import { User } from '../Models/User';
import { StatusCodes } from 'http-status-codes';
import * as CustomError from '../errors';
import createTokenUser from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const isUniqueEmail = await User.findOne({ email });
  if (isUniqueEmail) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  const verificationToken = crypto.randomBytes(40).toString('hex');

  await User.create({ email, name, password, verificationToken });
  await sendEmail();
  res.status(StatusCodes.CREATED).json({ msg: 'Check Your Mailbox' });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const {
    verificationToken,
    email,
  }: { verificationToken: string; email: string } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Failed');
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed');
  }

  user.isVerified = true;
  user.verifiedOn = Date.now();
  user.verificationToken = '';

  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Email Verified!' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please, verify your email');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ msg: 'Logged in' });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'Logged Out' });
};
