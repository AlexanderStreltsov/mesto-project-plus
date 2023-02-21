import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type IUser } from '../types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value: string) {
        return isURL(value);
      },
    },
  },
});

export default model<IUser>('user', userSchema);
