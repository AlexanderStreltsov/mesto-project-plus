import { type Request, type Response } from 'express';
import { User } from '../models';
import { type ICustomRequest } from '../types';
import {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../constants/status-codes';
import {
  SERVER_ERROR_MSG,
  USER_NOT_FOUND_MSG,
  USER_INCORRECT_ID_MSG,
  USER_INCORRECT_CREATE_MSG,
  USER_INCORRECT_UPDATE_MSG,
  USER_AVATAR_INCORRECT_UPDATE_MSG,
} from '../constants/error-messages';

const getUsers = (req: Request, res: Response) =>
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MSG }),
    );

const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      const error = new Error(USER_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return res
            .status(BAD_REQUEST)
            .send({ message: USER_INCORRECT_ID_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      return err.name === 'ValidationError'
        ? res.status(BAD_REQUEST).send({ message: USER_INCORRECT_CREATE_MSG })
        : res.status(INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR_MSG });
    });
};

const updateUser = (req: ICustomRequest, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req?.user?._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .orFail(() => {
      const error = new Error(USER_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          return res
            .status(BAD_REQUEST)
            .send({ message: USER_INCORRECT_UPDATE_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

const updateAvatar = (req: ICustomRequest, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req?.user?._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .orFail(() => {
      const error = new Error(USER_NOT_FOUND_MSG);
      error.name = 'FoundError';
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          return res
            .status(BAD_REQUEST)
            .send({ message: USER_AVATAR_INCORRECT_UPDATE_MSG });
        case 'FoundError':
          return res.status(NOT_FOUND).send({ message: err.message });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: SERVER_ERROR_MSG });
      }
    });
};

export { getUsers, getUserById, createUser, updateUser, updateAvatar };
