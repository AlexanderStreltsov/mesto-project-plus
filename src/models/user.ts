import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type IUser } from '../types';
import {
  REQUIRED_MSG,
  MIN_2_MSG,
  MAX_30_MSG,
  MAX_200_MSG,
  VALIDATE_URL_MSG,
} from '../constants/error-messages';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, REQUIRED_MSG],
    minlength: [2, MIN_2_MSG],
    maxlength: [30, MAX_30_MSG],
  },
  about: {
    type: String,
    required: [true, REQUIRED_MSG],
    minlength: [2, MIN_2_MSG],
    maxlength: [200, MAX_200_MSG],
  },
  avatar: {
    type: String,
    required: [true, REQUIRED_MSG],
    validate: {
      validator(value: string) {
        return isURL(value);
      },
      message: VALIDATE_URL_MSG,
    },
  },
});

export default model<IUser>('user', userSchema);
