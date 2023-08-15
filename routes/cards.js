const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

// роутер /cards
router.get('/cards', getCards);

router.post('/cards', createCard);

// роутер /cards/:cardId удаление карточки

router.delete('/cards/:cardId', deleteCard);

// роутер /cards/:cardId/likes

router.put('/cards/:cardId/likes', addLikeCard);

router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
