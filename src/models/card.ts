import { Schema, model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { type ICard } from '../types';

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(value: string) {
        return isURL(value);
      },
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
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
