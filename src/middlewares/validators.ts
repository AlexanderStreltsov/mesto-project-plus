import { celebrate, Joi } from 'celebrate';
import isURL from 'validator/lib/isURL';
import {
  USER_NAME,
  USER_ABOUT,
  USER_AVATAR,
} from '../constants/default-values';
import {
  USER_NAME_MIN_MSG,
  USER_NAME_MAX_MSG,
  USER_ABOUT_MIN_MSG,
  USER_ABOUT_MAX_MSG,
  USER_AVATAR_EMPTY_MSG,
  USER_AVATAR_URL_MSG,
  USER_EMAIL_REQUIRED_MSG,
  USER_EMAIL_VALID_MSG,
  USER_PASSWORD_REQUIRED_MSG,
  USER_ID_REQUIRED_MSG,
  USER_ID_LENGTH_MSG,
  USER_ID_HEX_MSG,
  CARD_NAME_REQUIRED_MSG,
  CARD_NAME_MIN_MSG,
  CARD_NAME_MAX_MSG,
  CARD_LINK_REQUIRED_MSG,
  CARD_LINK_URL_MSG,
  CARD_ID_REQUIRED_MSG,
  CARD_ID_LENGTH_MSG,
  CARD_ID_HEX_MSG,
} from '../constants/error-messages';

const validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default(USER_NAME).messages({
      'string.empty': USER_NAME_MIN_MSG,
      'string.min': USER_NAME_MIN_MSG,
      'string.max': USER_NAME_MAX_MSG,
    }),
    about: Joi.string().min(2).max(200).default(USER_ABOUT).messages({
      'string.empty': USER_ABOUT_MIN_MSG,
      'string.min': USER_ABOUT_MIN_MSG,
      'string.max': USER_ABOUT_MAX_MSG,
    }),
    avatar: Joi.string()
      .default(USER_AVATAR)
      .custom((value, helpers) =>
        isURL(value)
          ? value
          : helpers.message({
              message: USER_AVATAR_URL_MSG,
            }),
      )
      .messages({
        'string.empty': USER_AVATAR_EMPTY_MSG,
        custom: USER_AVATAR_URL_MSG,
      }),
    email: Joi.string().required().email().messages({
      'any.required': USER_EMAIL_REQUIRED_MSG,
      'string.empty': USER_EMAIL_REQUIRED_MSG,
      'string.email': USER_EMAIL_VALID_MSG,
    }),
    password: Joi.string().required().messages({
      'any.required': USER_PASSWORD_REQUIRED_MSG,
      'string.empty': USER_PASSWORD_REQUIRED_MSG,
    }),
  }),
});

const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': USER_EMAIL_REQUIRED_MSG,
      'string.empty': USER_EMAIL_REQUIRED_MSG,
      'string.email': USER_EMAIL_VALID_MSG,
    }),
    password: Joi.string().required().messages({
      'any.required': USER_PASSWORD_REQUIRED_MSG,
      'string.empty': USER_EMAIL_REQUIRED_MSG,
    }),
  }),
});

const validateGetUserByIdParams = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex().messages({
      'any.required': USER_ID_REQUIRED_MSG,
      'string.empty': USER_ID_REQUIRED_MSG,
      'string.length': USER_ID_LENGTH_MSG,
      'string.hex': USER_ID_HEX_MSG,
    }),
  }),
});

const validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.empty': USER_NAME_MIN_MSG,
      'string.min': USER_NAME_MIN_MSG,
      'string.max': USER_NAME_MAX_MSG,
    }),
    about: Joi.string().min(2).max(200).messages({
      'string.empty': USER_ABOUT_MIN_MSG,
      'string.min': USER_ABOUT_MIN_MSG,
      'string.max': USER_ABOUT_MAX_MSG,
    }),
  }),
});

const validateUpdateUserAvatarBody = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .custom((value, helpers) =>
        isURL(value)
          ? value
          : helpers.message({
              message: USER_AVATAR_URL_MSG,
            }),
      )
      .messages({
        'string.empty': USER_AVATAR_EMPTY_MSG,
        custom: USER_AVATAR_URL_MSG,
      }),
  }),
});

const validateCreateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': CARD_NAME_MIN_MSG,
      'string.min': CARD_NAME_MIN_MSG,
      'string.max': CARD_NAME_MAX_MSG,
      'any.required': CARD_NAME_REQUIRED_MSG,
    }),
    link: Joi.string()
      .required()
      .custom((value, helpers) =>
        isURL(value)
          ? value
          : helpers.message({
              message: CARD_LINK_URL_MSG,
            }),
      )
      .messages({
        'string.empty': CARD_LINK_REQUIRED_MSG,
        'any.required': CARD_LINK_REQUIRED_MSG,
        custom: CARD_LINK_URL_MSG,
      }),
  }),
});

const validateCardIdParams = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex().messages({
      'any.required': CARD_ID_REQUIRED_MSG,
      'string.empty': CARD_ID_REQUIRED_MSG,
      'string.length': CARD_ID_LENGTH_MSG,
      'string.hex': CARD_ID_HEX_MSG,
    }),
  }),
});

export {
  validateCreateUserBody,
  validateLoginBody,
  validateGetUserByIdParams,
  validateUpdateUserBody,
  validateUpdateUserAvatarBody,
  validateCreateCardBody,
  validateCardIdParams,
};
