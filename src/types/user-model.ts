import { type Model, type Document, type Types } from 'mongoose';
import { type IUser } from './user';

/* eslint-disable no-unused-vars */
export interface IUserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<Document<unknown, any, IUser>>;
  findUserAndUpdateById: (
    id: Types.ObjectId,
    params: { name?: string; about?: string; avatar?: string },
  ) => Promise<Document<unknown, any, IUser>>;
}
