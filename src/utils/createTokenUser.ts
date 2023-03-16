import { IUser } from '../Models/User';
import Types from 'mongoose';

const createTokenUser = <T extends IUser & { _id: Types.ObjectId }>(
  user: T
) => {
  return { name: user.name, userId: user._id, role: user.role };
};

export default createTokenUser;
