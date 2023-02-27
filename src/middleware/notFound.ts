import { Request, Response } from 'express';

type notFound = (req: Request, res: Response) => any;

export const notFoundMiddleware: notFound = (req, res) => {
  res.status(404).send('Route does not exist');
};
