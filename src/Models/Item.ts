import * as mongoose from 'mongoose';

const listOfBrands = [
  'Nike',
  'Louis Vuitton',
  'Hermes',
  'Gucci',
  'Tiffany & Co.',
  'Zara',
  'H&M',
  'Rolex',
  'Burberry',
  'Adidas',
];
const conditionList = ['New', 'Very Good', 'Good', 'Poor'];

const categoryList = ['woman', 'men', 'kids', 'about'];

const typeList = ['Shoes', 'Clothes', 'Accessories'];

const ItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner should be provided'],
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
      enum: {
        values: categoryList,
        message: '{VALUE} is not supported',
      },
    },
    brand: {
      type: String,
      required: [true, 'Category should be provided'],
      enum: {
        values: listOfBrands,
        message: '{VALUE} is not supported',
      },
    },
    type: {
      type: String,
      required: [true, 'Type should be provided'],
      enum: {
        values: typeList,
        message: '{VALUE} is not supported',
      },
    },
    condition: {
      type: String,
      required: [true, 'Category should be provided'],
      enum: {
        values: conditionList,
        message: '{VALUE} is not supported',
      },
    },
    price: {
      default: 0,
      type: Number,
      required: [true, 'Name should be provided'],
    },
    images: {
      type: [String],
      required: [true, 'Images should be provided'],
    },
  },
  { timestamps: true }
);

export interface IItem extends mongoose.Document {
  owner: mongoose.Schema.Types.ObjectId;
  description: string;
  title: string;
  category: string;
  brand: string;
  condition: string;
  typeList: string;
  price: Number;
  images?: Array<string>;
}

export const Item = mongoose.model<IItem>('Item', ItemSchema);
