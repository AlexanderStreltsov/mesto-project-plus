import { Router } from 'express';
import { createUser, login } from '../controllers/users';
import { validateCreateUserBody, validateLoginBody } from '../middlewares';

const router = Router();

router.post('/signup', validateCreateUserBody, createUser);
router.post('/signin', validateLoginBody, login);

export default router;
