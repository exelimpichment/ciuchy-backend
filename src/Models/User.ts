import * as mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

import {
  languageList,
  countryList,
  genderList,
  roleList,
  datePattern,
} from '../utils/defaultModelEnums';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please, provide name'],
      minlength: 6,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Please, provide email'],
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
    image: {
      type: String,
      default: 'https://ciuchy-backend.s3.eu-central-1.amazonaws.com/user.png',
    },
    country: {
      type: String,
      enum: countryList,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },

    about: {
      type: String,
      minlength: 30,
      maxlength: 200,
    },
    gender: {
      type: String,
      enum: genderList,
      default: '',
    },
    role: {
      type: String,
      enum: roleList,
      default: 'user',
    },
    dateOfBirth: {
      type: String,
      match: [datePattern, 'Invalid date format.'],
      default: '0000-00-00',
    },
    language: {
      type: String,
      enum: languageList,
      default: 'English(English)',
    },
    holidayMode: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedOn: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'owner',
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

type countryType =
  | 'Germany'
  | 'United Kingdom'
  | 'France'
  | 'Italy'
  | 'Spain'
  | 'Ukraine'
  | 'Poland'
  | 'Romania'
  | 'Netherlands'
  | 'Greece'
  | 'Portugal'
  | 'Austria'
  | 'Denmark';

type languageType =
  | 'English(English)'
  | 'Украінська(Ukrainian)'
  | 'Polski(Polish)';

type genderType = 'Woman' | 'Man' | 'Other' | 'Select gender';

type roleType = 'admin' | 'user';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  image: string;
  about: string;
  rating: number;
  country: countryType;
  role: roleType;
  gender: genderType;
  dateOfBirth: string;
  language: languageType;
  holidayMode: boolean;
  verificationToken: string;
  isVerified: boolean;
  verifiedOn: number;
  passwordTokenExpirationDate: number | null;
  passwordToken: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const User = mongoose.model<IUser>('User', UserSchema);
