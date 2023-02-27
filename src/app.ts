import './utils/env';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import routes from './routes';
import { errorHandler, requestLogger, errorLogger } from './middlewares';

const { PORT = '', DB = '' } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const run = async () => {
  await mongoose.connect(DB);
  await app.listen(PORT);
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
