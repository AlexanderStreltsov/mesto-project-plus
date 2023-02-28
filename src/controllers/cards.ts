import { type Request, type Response, type NextFunction } from 'express';
import { Error } from 'mongoose';
import { type ICustomRequest } from '../types';
import { Card } from '../models';
import { getCustomValidationMsg } from '../utils';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors';
import { CREATED } from '../constants/status-codes';
import {
  CARD_INCORRECT_ID_MSG,
  CARD_NOT_FOUND_MSG,
  CARD_INCORRECT_ID_LIKE_MSG,
  CARD_INCORRECT_ID_DISLIKE_MSG,
  CARD_DELETE_FORBIDDEN_MSG,
} from '../constants/error-messages';

const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);

const createCard = (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req?.user?._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(getCustomValidationMsg(err)));
      } else {
        next(err);
      }
    });
};

const deleteCardById = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError(CARD_NOT_FOUND_MSG));
    }

    if (card.owner.toString() === req?.user?._id.toString()) {
      await card.delete();
      return res.send({ data: card });
    }

    return next(new ForbiddenError(CARD_DELETE_FORBIDDEN_MSG));
  } catch (err) {
    if (err instanceof Error.CastError) {
      return next(new BadRequestError(CARD_INCORRECT_ID_MSG));
    }

    return next(err);
  }
};

const likeCard = (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(CARD_NOT_FOUND_MSG);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CARD_INCORRECT_ID_LIKE_MSG));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req?.user?._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(CARD_NOT_FOUND_MSG);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CARD_INCORRECT_ID_DISLIKE_MSG));
      } else {
        next(err);
      }
    });
};

export { getCards, createCard, deleteCardById, likeCard, dislikeCard };
