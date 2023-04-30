//! this can be implemented using classes with static methods
//! but I decided to use functional programming here
//! since I find this method more widely used
import { Request, Response } from 'express';
import { User } from '../Models/User';
import { Token } from '../Models/Token';
import { StatusCodes } from 'http-status-codes';
import * as CustomError from '../errors';
import createTokenUser from '../utils/createTokenUser';
import crypto from 'crypto';
import sendVerificationEmail from '../utils/sendVerificationEmail';
import { attachCookiesToResponse } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const isUniqueEmail = await User.findOne({ email });
  if (isUniqueEmail) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const origin = 'http://localhost:3000';

  const user = await User.create({ email, name, password, verificationToken });
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken,
    origin,
  });
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
    throw new CustomError.UnauthenticatedError(
      'Please, verify your email first'
    );
  }

  const userForTokenization = createTokenUser(user); // <== {name, userId, role}

  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, userForTokenization, refreshToken });
    res
      .status(StatusCodes.OK)
      .json({ user: userForTokenization, msg: 'Logged In' });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');

  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, userForTokenization, refreshToken });

  res
    .status(StatusCodes.OK)
    .json({ user: userForTokenization, msg: 'Logged In' });
};

export const logout = async (req: Request, res: Response) => {
  await Token.findOneAndDelete({ user: req.user?.userId });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'Logged Out' });
};
