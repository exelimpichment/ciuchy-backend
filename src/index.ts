import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connect';

import 'express-async-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { notFoundMiddleware } from './middleware/notFound';
import { errorHandlerMiddleware } from './middleware/errorHandler';

import { router as authRoutes } from './routes/authRoutes';
import { router as userRoutes } from './routes/userRoutes';
import { router as itemRoutes } from './routes/itemRoutes';

const cors = require('cors');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('tiny'));

app.use(
  cors({
    origin: ['https://ciuchy.store', 'http://localhost:3000'], // res.set('Access-Control-Allow-Origin', req.headers.origin);
    credentials: true, // res.set('Access-Control-Allow-Credentials', 'true');
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/item', itemRoutes);

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
