const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

// роутер /cards
router.get('/cards', auth, getCards);

router.post('/cards', auth, createCard);

// роутер /cards/:cardId удаление карточки

router.delete('/cards/:cardId', auth, deleteCard);

// роутер /cards/:cardId/likes

router.put('/cards/:cardId/likes', auth, addLikeCard);

router.delete('/cards/:cardId/likes', auth, deleteLikeCard);

module.exports = router;
