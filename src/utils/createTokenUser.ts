import { IUser } from '../Models/User';
import Types from 'mongoose';

const createTokenUser = <UserWithId extends IUser & { _id: Types.ObjectId }>(
  user: UserWithId
) => {
  return { name: user.name, userId: user._id, role: user.role };
};

export default createTokenUser;
