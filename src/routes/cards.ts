import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCreateCardBody, validateCardIdParams } from '../middlewares';

const router = Router();

router.get('/', getCards);
router.post('/', validateCreateCardBody, createCard);
router.put('/:cardId/likes', validateCardIdParams, likeCard);
router.delete('/:cardId', validateCardIdParams, deleteCardById);
router.delete('/:cardId/likes', validateCardIdParams, dislikeCard);

export default router;
