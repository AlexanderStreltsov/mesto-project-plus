import '../utils/env';
import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type IUserPayload, type ICustomRequest } from '../types';
import { UnauthorizedError } from '../errors';
import { JWT_SALT_DEV } from '../constants/auth';
import { USER_NOT_AUTH_MSG } from '../constants/error-messages';

const { JWT_SALT = JWT_SALT_DEV } = process.env;

const auth = (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError(USER_NOT_AUTH_MSG);
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SALT as string) as IUserPayload;
  } catch (err) {
    throw new UnauthorizedError(USER_NOT_AUTH_MSG);
  }

  req.user = payload;

  next();
};

export default auth;
