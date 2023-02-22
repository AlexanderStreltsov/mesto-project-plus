import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type ICard } from '../types';
import {
  REQUIRED_MSG,
  MIN_2_MSG,
  MAX_30_MSG,
  VALIDATE_URL_MSG,
} from '../constants/error-messages';

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: [true, REQUIRED_MSG],
    minlength: [2, MIN_2_MSG],
    maxlength: [30, MAX_30_MSG],
  },
  link: {
    type: String,
    required: [true, REQUIRED_MSG],
    validate: {
      validator(value: string) {
        return isURL(value);
      },
      message: VALIDATE_URL_MSG,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, REQUIRED_MSG],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
