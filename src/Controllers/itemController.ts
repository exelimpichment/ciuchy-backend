import { Request, Response } from 'express';
import { Item } from '../Models/Item';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import * as CustomError from '../errors';
import { s3 } from '../utils/s3instance';
import {
  PutObjectCommand,
  // , S3Client
} from '@aws-sdk/client-s3';

// const accessKeyId = process.env.ACCESS_KEY || '';
// const secretAccessKey = process.env.SECRET_ACCESS_KEY || '';
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
//   region: 'eu-central-1',
// });

export const addItem = async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    brand,
    condition,
    type,
    price,
    owner = '645eda857ac2714b0a1f3f18',
  } = req.body;

  if (!req.files) {
    throw new CustomError.BadRequestError('Images were not uploaded');
  }

  if (
    !title ||
    !description ||
    !category ||
    !brand ||
    !type ||
    !condition ||
    !price
  ) {
    throw new CustomError.BadRequestError('All fields are required');
  }

  const uploadToS3 = async (files: Express.Multer.File[]) => {
    const images: Array<string> = [];

    for (const file of files) {
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
        images.push(url);
      } catch (error) {
        console.log(error);
      }
    }
    return images;
  };

  const images = await uploadToS3(req.files as Express.Multer.File[]);

  const item = new Item({
    owner,
    title,
    description,
    category,
    brand,
    type,
    condition,
    price,
    images,
  });
  await item.save();

  res.status(StatusCodes.CREATED).json({
    msg: 'Item created',
    response: item,
  });
};

export const getSingleItem = async (req: Request, res: Response) => {
  const { _id } = req.params;

  const singleItem = await Item.findOne({ _id });
  console.log(singleItem);

  res.status(StatusCodes.OK).json({ singleItem });
};
