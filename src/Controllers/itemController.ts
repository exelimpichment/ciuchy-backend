import { Request, Response } from 'express';

export const getSingleItem = async (req: Request, res: Response) => {
  res.send('get single user');
};
export const getItems = async (req: Request, res: Response) => {
  res.send('getItems');
};
