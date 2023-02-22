import { type Request, type Response } from 'express';
import { type ObjectId } from 'mongoose';
import { type ICustomRequest } from '../types';
import { Card } from '../models';
import {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../constants/status-codes';
import {
  SERVER_ERROR_MSG,
  CARD_INCORRECT_ID_MSG,
  CARD_NOT_FOUND_MSG,
  CARD_INCORRECT_ID_LIKE_MSG,
  CARD_INCORRECT_ID_DISLIKE_MSG,
} from '../constants/error-messages';

const getCards = (req: Request, res: Response) =>
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MSG }),
    );

const createCard = (req: ICustomRequest, res: Response) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req?.user?._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      return err.name === 'ValidationError'
        ? res.status(BAD_REQUEST).send({ message: err.message })
        : res.status(INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
};

const deleteCardById = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error(CARD_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return res
            .status(BAD_REQUEST)
            .send({ message: CARD_INCORRECT_ID_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

const likeCard = (req: ICustomRequest, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error(CARD_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return res
            .status(BAD_REQUEST)
            .send({ message: CARD_INCORRECT_ID_LIKE_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

const dislikeCard = (req: ICustomRequest, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req?.user?._id as unknown as ObjectId } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error(CARD_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return res
            .status(BAD_REQUEST)
            .send({ message: CARD_INCORRECT_ID_DISLIKE_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

export { getCards, createCard, deleteCardById, likeCard, dislikeCard };
