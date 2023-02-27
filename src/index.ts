// dotenv package
import * as dotenv from 'dotenv';
dotenv.config();
// express
import express from 'express';
const app = express();
// database
import connectDB from './db/connect';

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

app.get('/', (req, res) => {
  res.json({ msg: 'test' });
});

app.use('/api/v1/auth', authRoutes);

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
