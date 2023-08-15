const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

// роутер /cards
router.get('/cards', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  })}), getCards);

router.post('/cards', createCard);

// роутер /cards/:cardId удаление карточки

router.delete('/cards/:cardId', deleteCard);

// роутер /cards/:cardId/likes

router.put('/cards/:cardId/likes', addLikeCard);

router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
