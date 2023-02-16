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

app.get('/', (req, res) => {
  res.json({ msg: 'test' });
});

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
