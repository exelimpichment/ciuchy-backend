import * as mongoose from 'mongoose';
import {
  brandList,
  conditionList,
  categoryList,
  colorList,
  typeList,
  stateList,
} from '../utils/defaultModelEnums';

const ItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner should be provided'],
    },
    ownerImage: {
      type: String,
      required: [true, 'Owner image should be provided'],
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name should be provided'],
    },
    ownerRating: {
      default: 0,
      type: Number,
      required: [true, 'Owner rating should be provided'],
    },
    title: {
      type: String,
      required: [true, 'Name should be provided'],
      minlength: 6,
      maxlength: 40,
    },
    description: {
      type: String,
      required: [true, 'Description should be provided'],
      minlength: 10,
      maxlength: 400,
    },
    category: {
      type: String,
      required: [true, 'Category should be provided'],
      enum: categoryList,
    },
    brand: {
      type: String,
      required: [true, 'Brand should be provided'],
      enum: brandList,
    },
    color: {
      type: String,
      required: [true, 'Color should be provided'],
      enum: colorList,
    },
    type: {
      type: String,
      required: [true, 'Type should be provided'],
      enum: typeList,
    },
    condition: {
      type: String,
      required: [true, 'Condition should be provided'],
      enum: conditionList,
    },
    price: {
      default: 0,
      type: Number,
      required: [true, 'Price should be provided'],
    },
    images: {
      type: [String],
      required: [true, 'Images should be provided'],
    },
    state: {
      type: String,
      enum: stateList,
      default: 'Active',
    },
  },
  { timestamps: true }
);

type brandsTypes =
  | 'Nike'
  | 'Louis Vuitton'
  | 'Hermes'
  | 'Gucci'
  | 'Tiffany & Co.'
  | 'Zara'
  | 'H&M'
  | 'Rolex'
  | 'Burberry'
  | 'Adidas';

type conditionType = 'New' | 'Very Good' | 'Good' | 'Poor';

type categoryType = 'woman' | 'men' | 'kids' | 'about';

type typeVariants = 'Shoes' | 'Clothes' | 'Accessories';

type stateType = 'Draft' | 'Active';

export interface IItem extends mongoose.Document {
  ownerImage: string;
  ownerName: string;
  owner: mongoose.Schema.Types.ObjectId;
  description: string;
  title: string;
  category: categoryType;
  brand: brandsTypes;
  condition: conditionType;
  typeList: typeVariants;
  price: number;
  images?: Array<string>;
  state: stateType;
  ownerRating: number;
}

export const Item = mongoose.model<IItem>('Item', ItemSchema);
