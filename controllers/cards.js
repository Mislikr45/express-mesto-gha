const mongoose = require('mongoose');
const Card = require('../models/card');

// 400
const BadRequestError = require('../errors/BadRequestError');
// 404
const NotFoundError = require('../errors/NotFoundError');
// 500
const DefaultErore = require('../errors/DefaultErore');

module.exports.getCards = (req, res, next) => {
  Card.find({}).then((cards) => res.send({ data: cards })).catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const _id = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(
          ' Карточка с указанным _id не найдена',
        ));
      }
    }).catch(() => next(new DefaultErore(
      'Ошибка по умолчанию',
    )));

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      const _id = req.user;
      if (!card) {
        return next(new NotFoundError(
          ' Карточка с указанным _id не найдена',
        ));
      } if (String(card.owner) !== String(_id)) {
        return res
          .status(403)
          .json({ message: 'Переданы некорректные данные' });
      }
      return res.send({ data: card });
    })
    .catch(() => next(new DefaultErore(
      'Ошибка по умолчанию',
    )));
};

module.exports.addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const _id = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    // return next(new BadRequestError(
    //   'Переданы некорректные данные для постановки/снятии лайка.',
    // ));
    throw new BadRequestError('Карточка с указанным id не найдена');
  }
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(
          'Передан несуществующий _id карточки',
        ));
      }
      return res.status(201).send({ data: card });
    })
    .catch(() => next(new DefaultErore(
      'Ошибка по умолчанию',
    )));
};

module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const _id = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    // return next(new BadRequestError(
    //   'Переданы некорректные данные для постановки/снятии лайка.',
    // ));
    throw new BadRequestError('Карточка с указанным id не найдена');
  }
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(
          'Передан несуществующий _id карточки',
        ));
      }
      return res.send({ data: card });
    })
    .catch(() => next(new DefaultErore(
      'Ошибка по умолчанию',
    )));
};
