import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type ICard } from '../types';
import {
  CARD_NAME_REQUIRED_MSG,
  CARD_NAME_MIN_MSG,
  CARD_NAME_MAX_MSG,
  CARD_LINK_REQUIRED_MSG,
  CARD_LINK_URL_MSG,
  CARD_OWNER_REQUIRED_MSG,
} from '../constants/error-messages';

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: [true, CARD_NAME_REQUIRED_MSG],
    minlength: [2, CARD_NAME_MIN_MSG],
    maxlength: [30, CARD_NAME_MAX_MSG],
  },
  link: {
    type: String,
    required: [true, CARD_LINK_REQUIRED_MSG],
    validate: {
      validator(value: string) {
        return isURL(value);
      },
      message: CARD_LINK_URL_MSG,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, CARD_OWNER_REQUIRED_MSG],
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
