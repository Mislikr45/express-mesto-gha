const mongoose = require('mongoose');
const Card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards })).catch(() => res.status(ERROR_CODE_404).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const _id = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      const _id = req.user;
      if (!card) { return res.status(ERROR_CODE_404).send({ message: ' Карточка с указанным _id не найдена' }); }
      if (String(card.owner) !== String(_id)) {
        return res
          .status(403)
          .json({ message: 'You do not have permission to delete this card' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.addLikeCard = (req, res) => {
  const { cardId } = req.params;
  const _id = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) { res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки' }); }
      res.status(201).send({ data: card });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  const _id = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) { res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки' }); }
      res.send({ data: card });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
};
