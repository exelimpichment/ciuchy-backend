//! this can be implemented using classes with static methods
//! but I decided to use functional programming here
//! since I find this method more widely used across the internet
import { Request, Response } from 'express';
// import User from '../Models/User';
// import * as CustomError from '../errors';

export const register = async (req: Request, res: Response) => {
  res.send('register');
};

export const login = async (req: Request, res: Response) => {
  res.send('login');
};

export const logout = async (req: Request, res: Response) => {
  res.send('logout');
};
