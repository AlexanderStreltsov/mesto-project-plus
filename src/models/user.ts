import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type IUser } from '../types';
import {
  USER_NAME_REQUIRED_MSG,
  USER_NAME_MIN_MSG,
  USER_NAME_MAX_MSG,
  USER_ABOUT_REQUIRED_MSG,
  USER_ABOUT_MIN_MSG,
  USER_ABOUT_MAX_MSG,
  USER_AVATAR_REQUIRED_MSG,
  USER_AVATAR_URL_MSG,
} from '../constants/error-messages';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, USER_NAME_REQUIRED_MSG],
    minlength: [2, USER_NAME_MIN_MSG],
    maxlength: [30, USER_NAME_MAX_MSG],
  },
  about: {
    type: String,
    required: [true, USER_ABOUT_REQUIRED_MSG],
    minlength: [2, USER_ABOUT_MIN_MSG],
    maxlength: [200, USER_ABOUT_MAX_MSG],
  },
  avatar: {
    type: String,
    required: [true, USER_AVATAR_REQUIRED_MSG],
    validate: {
      validator(value: string) {
        return isURL(value);
      },
      message: USER_AVATAR_URL_MSG,
    },
  },
});

export default model<IUser>('user', userSchema);
