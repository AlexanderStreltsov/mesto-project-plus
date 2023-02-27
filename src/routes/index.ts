import { Router } from 'express';
import usersRoutes from './users';
import cardsRoutes from './cards';
import authRoutes from './auth';
import { auth } from '../middlewares';

const router = Router();

router.use(authRoutes);
router.use('/users', auth, usersRoutes);
router.use('/cards', auth, cardsRoutes);

export default router;
