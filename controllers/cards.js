const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards })).catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    next(res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }));
  }
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) { res.status(404).send({ message: ' Карточка с указанным _id не найдена' }); }
      res.status(200).send({ data: card });
    });
};

module.exports.addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    next(res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }));
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) { res.status(404).send({ message: 'Передан несуществующий _id карточки' }); }
      res.status(201).send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    next(res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }));
  }
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) { res.status(404).send({ message: 'Передан несуществующий _id карточки' }); }
      res.status(200).send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};
