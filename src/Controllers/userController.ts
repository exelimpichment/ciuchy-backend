import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../Models/User';
import * as CustomError from '../errors';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../utils/s3instance';

export const getUserSearchList = async (req: Request, res: Response) => {
  const { user } = req.query;

  const listOfUsers = await User.find({ name: { $regex: user, $options: 'i' } })
    .select('-password')
    .limit(5);
  res.status(StatusCodes.OK).json({ listOfUsers, nbHits: listOfUsers.length });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const {
    oldPassword,
    newPassword,
  }: { oldPassword: string; newPassword: string } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'please provide old and new password'
    );
  }
  const user = await User.findOne({ _id: req.user?.userId });

  const isPasswordCorrect = await user?.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }
  if (user !== null) {
    user.password = newPassword;
    await user.save();
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

export const updateProfileDetails = async (req: Request, res: Response) => {
  const { about, language, country } = req.body;
  const file = req.file;
  console.log(req.body);

  const user = await User.findOne({ _id: req.user?.userId });

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  if (file) {
    const randomImageName = (bites = 24) =>
      crypto.randomBytes(bites).toString('hex');

    const params = {
      Bucket: process.env.BACKET_NAME,
      Key: randomImageName(),
      Body: file.buffer,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3.send(command);

      const url = `https://${process.env.BACKET_NAME}.s3.eu-central-1.amazonaws.com/${params.Key}`;
      user.image = url;
    } catch (error) {
      console.log(error);
    }
  }

  if (about) {
    user.about = about;
  }
  if (language) {
    user.language = language;
  }
  if (country) {
    user.country = country;
  }

  await user.save();

  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  const user = await User.findOne({ _id })
    .select('-password')
    .populate('items');

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${_id} `);
  }

  res.status(StatusCodes.OK).json({ user });
};
