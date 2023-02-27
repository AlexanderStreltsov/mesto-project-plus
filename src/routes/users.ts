import { Router } from 'express';
import {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} from '../controllers/users';
import {
  validateGetUserByIdParams,
  validateUpdateUserBody,
  validateUpdateUserAvatarBody,
} from '../middlewares';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateGetUserByIdParams, getUserById);
router.patch('/me', validateUpdateUserBody, updateUser);
router.patch('/me/avatar', validateUpdateUserAvatarBody, updateAvatar);

export default router;
