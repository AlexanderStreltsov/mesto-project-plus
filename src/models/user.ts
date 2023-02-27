import { Schema, model, type Types } from 'mongoose';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import { type IUser, type IUserModel } from '../types';
import { NotFoundError, UnauthorizedError } from '../errors';
import {
  USER_NAME_MIN_MSG,
  USER_NAME_MAX_MSG,
  USER_ABOUT_MIN_MSG,
  USER_ABOUT_MAX_MSG,
  USER_AVATAR_URL_MSG,
  USER_EMAIL_REQUIRED_MSG,
  USER_EMAIL_VALID_MSG,
  USER_PASSWORD_REQUIRED_MSG,
  USER_UNAUTHORIZED_MSG,
  USER_NOT_FOUND_MSG,
} from '../constants/error-messages';
import {
  USER_NAME,
  USER_ABOUT,
  USER_AVATAR,
} from '../constants/default-values';

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: [2, USER_NAME_MIN_MSG],
    maxlength: [30, USER_NAME_MAX_MSG],
    default: USER_NAME,
  },
  about: {
    type: String,
    minlength: [2, USER_ABOUT_MIN_MSG],
    maxlength: [200, USER_ABOUT_MAX_MSG],
    default: USER_ABOUT,
  },
  avatar: {
    type: String,
    validate: {
      validator(value: string) {
        return isURL(value);
      },
      message: USER_AVATAR_URL_MSG,
    },
    default: USER_AVATAR,
  },
  email: {
    type: String,
    required: [true, USER_EMAIL_REQUIRED_MSG],
    unique: true,
    validate: {
      validator(value: string) {
        return isEmail(value);
      },
      message: USER_EMAIL_VALID_MSG,
    },
  },
  password: {
    type: String,
    required: [true, USER_PASSWORD_REQUIRED_MSG],
    select: false,
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .orFail(() => {
        throw new UnauthorizedError(USER_UNAUTHORIZED_MSG);
      })
      .then((user) => {
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(USER_UNAUTHORIZED_MSG);
          }
          return user;
        });
      });
  },
);

userSchema.static(
  'findUserAndUpdateById',
  function findUserAndUpdateById(
    id: Types.ObjectId,
    params: { name?: string; about?: string; avatar?: string },
  ) {
    return this.findByIdAndUpdate(id, params, {
      runValidators: true,
      new: true,
    })
      .orFail(() => {
        throw new NotFoundError(USER_NOT_FOUND_MSG);
      })
      .then((user) => user);
  },
);

export default model<IUser, IUserModel>('user', userSchema);
