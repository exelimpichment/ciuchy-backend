// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
// found on stackoverflow to remove deprecation warning
mongoose.set('strictQuery', false);

const connectDB = (url: string) => {
  mongoose.connect(url);
};

export default connectDB;
