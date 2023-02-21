import { type Request } from 'express';

export interface ICustomRequest extends Request {
  user?: {
    _id: string;
  };
}
