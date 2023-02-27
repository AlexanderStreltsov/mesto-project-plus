import { type Request, type Response, type NextFunction } from 'express';
import { type ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { type ICustomRequest } from '../types';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { getCustomValidationMsg, generateJwtToken } from '../utils';
import { CREATED } from '../constants/status-codes';
import DUPLICATE_CODE from '../constants/mongoose-error-codes';
import { HASH_SALT_ROUNDS, EXPIRED_TOKEN } from '../constants/auth';
import {
  USER_NOT_FOUND_MSG,
  USER_INCORRECT_ID_MSG,
  USER_DUPLICATE_MSG,
} from '../constants/error-messages';

const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);

const getUser = (req: ICustomRequest, res: Response, next: NextFunction) =>
  User.findById(req?.user?._id)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(USER_INCORRECT_ID_MSG));
      } else {
        next(err);
      }
    });

const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(USER_INCORRECT_ID_MSG));
      } else {
        next(err);
      }
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, HASH_SALT_ROUNDS)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.code === DUPLICATE_CODE) {
        next(new ConflictError(USER_DUPLICATE_MSG));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(getCustomValidationMsg(err)));
      } else {
        next(err);
      }
    });
};

const updateUser = (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req?.user?._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(getCustomValidationMsg(err)));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req?.user?._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(getCustomValidationMsg(err)));
      } else {
        next(err);
      }
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateJwtToken({ _id: user._id as ObjectId });

      res.cookie('token', token, {
        maxAge: EXPIRED_TOKEN,
        sameSite: true,
        httpOnly: true,
      });

      return res.send({ token });
    })
    .catch(next);
};

export {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
