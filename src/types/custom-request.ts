import { type Request } from 'express';
import { type ObjectId } from 'mongoose';

export interface ICustomRequest extends Request {
  user?: {
    _id: ObjectId;
  };
}
