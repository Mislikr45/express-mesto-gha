const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const url = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;

const {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

// роутер /cards
router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(url),
  }),
}), createCard);

// роутер /cards/:cardId удаление карточки

router.delete('/cards/:cardId', deleteCard);

// роутер /cards/:cardId/likes

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addLikeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLikeCard);

module.exports = router;
