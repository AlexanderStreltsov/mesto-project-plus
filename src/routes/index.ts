import { Router } from 'express';
import usersRoutes from './users';
import cardsRoutes from './cards';

const router = Router();

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

export default router;
