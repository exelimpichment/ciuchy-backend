import { Types } from 'mongoose';
import * as CustomError from '../errors';

interface IRequestUser {
  name: string;
  role: string;
  userId: string;
}

export const checkPermissions = (
  requestUser: IRequestUser,
  resourceUserId: Types.ObjectId
) => {
  //   console.log(requestUser);
  //   console.log(resourceUserId);
  //   console.log(typeof resourceUserId);
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};
