import { Router } from 'express';
import { createUser, login } from '../controllers/users';

const router = Router();

router.post('/signup', createUser);
router.post('/signin', login);

export default router;
