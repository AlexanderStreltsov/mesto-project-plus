import { type Request, type Response, type NextFunction } from 'express';
import { type ICustomError } from '../types';
import { INTERNAL_SERVER_ERROR } from '../constants/status-codes';
import { SERVER_ERROR_MSG } from '../constants/error-messages';

const errorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? SERVER_ERROR_MSG : message,
  });
  next();
};

export default errorHandler;
