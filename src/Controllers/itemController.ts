import { Request, Response } from 'express';
import { Item } from '../Models/Item';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import * as CustomError from '../errors';
import { s3 } from '../utils/s3instance';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IQueriesObject, IRequestQueries } from '../types/item.types';

export const addItem = async (req: Request, res: Response) => {
  const {
    color,
    title,
    description,
    category,
    brand,
    condition,
    type,
    price,
    owner,
    ownerImage,
    ownerName,
    ownerRating,
  } = req.body;

  if (Array.isArray(req.files) && req.files.length < 1) {
    throw new CustomError.BadRequestError('Images were not uploaded');
  }

  if (
    !color ||
    !ownerImage ||
    !ownerName ||
    !title ||
    !description ||
    !category ||
    !brand ||
    !type ||
    !condition ||
    !price ||
    !ownerRating
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
    color,
    title,
    description,
    category,
    brand,
    type,
    condition,
    price,
    images,
    ownerImage,
    ownerName,
    ownerRating,
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

  if (!singleItem) {
    throw new CustomError.NotFoundError('User not found');
  }

  const additionalItems = await Item.find({
    owner: singleItem.owner,
  }).limit(3);

  res.status(StatusCodes.OK).json({ singleItem, additionalItems });
};

export const getAllItems = async (req: Request, res: Response) => {
  const {
    // brand,
    // condition,
    // page,
    // color,
    // type,
    // category,
    sortby,
    from,
    to,
  }: IRequestQueries = req.query as IRequestQueries;

  const queryObject: IQueriesObject = {
    price: { $gt: Number(from) || 0, $lt: Number(to) || 9999 },
  };

  const queryParams = ['brand', 'condition', 'color', 'type', 'category'];
  for (const param of queryParams) {
    if (req.query[param]) {
      queryObject[param] = req.query[param] as string | number;
    }
  }
  let result = Item.find(queryObject);

  if (sortby) {
    switch (sortby) {
      case 'Price: high to low':
        result = result.sort({ price: -1 });
        break;

      case 'Price: low to high':
        result = result.sort({ price: 1 });
        break;

      case 'Newest first':
        result = result.sort({ createdAt: 1 });
        break;

      default:
        //no sorting
        break;
    }
  }

  // const limit = 12;
  // const skip = (Number(page) - 1) * limit;
  // result = result.skip(skip).limit(limit);

  const queriedList = await result;

  res.status(StatusCodes.OK).json({ numHits: queriedList.length, queriedList });
};

export const getSuggestions = async (req: Request, res: Response) => {
  const latestItems = await Item.find().sort({ createdAt: -1 }).limit(4);
  const forHim = await Item.find({
    category: 'men',
  }).limit(4);
  const bestPrice = await Item.find().sort({ price: -1 }).limit(4);

  res.status(StatusCodes.OK).json({
    latestItems,
    forHim,
    bestPrice,
  });
};
