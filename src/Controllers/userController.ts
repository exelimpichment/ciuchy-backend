import { Request, Response } from 'express';
// import { User } from '../Models/User';
import { StatusCodes } from 'http-status-codes';

export const getUserSearchList = async (req: Request, res: Response) => {
  // {{URL}}/user/getUserSearchList?user=testName
  res.status(StatusCodes.OK).json(req.query);
};
export const getSingleUser = async (req: Request, res: Response) => {
  // const user = await User.find({ role: 'user' }).select('-password');
  res.send('get single user');
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
