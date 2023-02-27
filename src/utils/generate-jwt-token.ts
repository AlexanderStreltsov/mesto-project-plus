import './env';
import jwt from 'jsonwebtoken';
import { type IUserPayload } from '../types';
import { JWT_SALT_DEV, EXPIRED_TOKEN } from '../constants/auth';

const { JWT_SALT = JWT_SALT_DEV } = process.env;

const generateJwtToken = (payload: IUserPayload) =>
  jwt.sign(payload, JWT_SALT, {
    expiresIn: EXPIRED_TOKEN,
  });

export default generateJwtToken;
