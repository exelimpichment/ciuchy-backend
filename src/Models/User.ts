import * as mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, provide name'],
    minlength: 6,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please, provide email'],
    // we could use regEx + match property but i used validator library
    validate: {
      validator: isEmail,
      message: 'Please, provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please, provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedOn: Date,
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // ^ the word _this_ refers to Schema
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  verificationToken: string;
  isVerified: boolean;
  verifiedOn: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const User = mongoose.model<IUser>('User', UserSchema);
