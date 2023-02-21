import './utils/env';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import addUserIdToReqTemp from './middlewares';

const { PORT = '', DB = '' } = process.env;

const app = express();

app.use(express.json());
app.use(addUserIdToReqTemp);
app.use(routes);

const run = async () => {
  await mongoose.connect(DB);
  await app.listen(PORT);
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
