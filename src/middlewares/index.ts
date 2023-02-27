import errorHandler from './error-handler';
import auth from './auth';
import { requestLogger, errorLogger } from './logger';
import {
  validateCreateUserBody,
  validateLoginBody,
  validateGetUserByIdParams,
  validateUpdateUserBody,
  validateUpdateUserAvatarBody,
  validateCreateCardBody,
  validateCardIdParams,
} from './validators';

export {
  errorHandler,
  auth,
  requestLogger,
  errorLogger,
  validateCreateUserBody,
  validateLoginBody,
  validateGetUserByIdParams,
  validateUpdateUserBody,
  validateUpdateUserAvatarBody,
  validateCreateCardBody,
  validateCardIdParams,
};
