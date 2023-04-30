import { Types } from 'mongoose';
import { IUser } from '../Models/User';

const createTokenUser = (
  user: IUser
): { name: string; userId: Types.ObjectId; role: 'user' | 'admin' } => {
  return { name: user.name, userId: user._id, role: user.role };
};

export default createTokenUser;
