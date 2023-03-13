// dotenv package
import * as dotenv from 'dotenv';
dotenv.config();
// express
import express from 'express';
const app = express();
// database
// import connectDB from './db/connect';
const connectDB = require('./db/connect');
// access to json
app.use(express.json());
// notFound & error handler middleware import
import { notFoundMiddleware } from './middleware/notFound';
import { errorHandlerMiddleware } from './middleware/errorHandler';
// to avoid making async wrappers manually did use this middleware
import 'express-async-errors';
// will add a middleware that logs our requests
// HTTP request logger middleware for node.js
// const morgan = require('morgan');
import morgan from 'morgan';
app.use(morgan('tiny'));
// routers
import { router as authRoutes } from './routes/authRoutes';
import { router as userRoutes } from './routes/userRoutes';
import { router as itemRoutes } from './routes/itemRoutes';
// parse cookies to read cookies that comes with each request
import cookieParser from 'cookie-parser';
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.json({ msg: 'test' });
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.json({ msg: 'cookies' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/item', itemRoutes);

// not found & error handler that I placed as two last middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    process.env.MONGO_URL !== undefined &&
      (await connectDB(process.env.MONGO_URL));
    app.listen(port, () => console.log(`listening to ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
