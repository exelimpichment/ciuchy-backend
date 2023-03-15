import { Request, Response } from 'express';
// import { User } from '../Models/User';
import { StatusCodes } from 'http-status-codes';
import { User } from '../Models/User';
import * as CustomError from '../errors';

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
  res.send('showMe');
};

export const updateUser = async (req: Request, res: Response) => {
  res.send('updateUser');
};

export const updateUsersPassword = async (req: Request, res: Response) => {
  res.send('updateUsersPassword');
};
