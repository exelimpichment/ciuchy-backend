import { Request, Response } from 'express';
// import { User } from '../Models/User';
import { StatusCodes } from 'http-status-codes';
import { User } from '../Models/User';
import * as CustomError from '../errors';
import createTokenUser from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';

export const getUserSearchList = async (req: Request, res: Response) => {
  const { user } = req.query;

  const listOfUsers = await User.find({ name: { $regex: user, $options: 'i' } })
    .select('-password')
    .limit(5);
  res.status(StatusCodes.OK).json({ listOfUsers, nbHits: listOfUsers.length });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const user = await User.findOne({ _id }).select('-password');

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${_id} `);
  }

  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const {
    oldPassword,
    newPassword,
  }: { oldPassword: string; newPassword: string } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'please provide old and new password'
    );
  }
  const user = await User.findOne({ _id: req.user?.userId });

  const isPasswordCorrect = await user?.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }
  if (user !== null) {
    user.password = newPassword;
    await user.save();
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please, provide all values');
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user?.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  if (user !== null) {
    let tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  }
};
