import { Request, Response } from 'express';

export const getSingleUsers = async (req: Request, res: Response) => {
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
