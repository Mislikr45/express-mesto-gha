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
  const id = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: id })
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
    }).then((card) => {
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== req.params_id) {
        return next(res
          .status(403)
          .json({ message: 'Переданы некорректные данные' }));
      }
    }).then((card) => {
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== req.params_id) {
        next(new NotFoundError(
          ' Карточка с указанным _id не найдена',
        ));
      } return res.send({ data: card });
    })
    .catch(() => next(new DefaultErore(
      'Ошибка по умолчанию',
    )));
};

//     .catch(() => next(new DefaultErore(
//       'Ошибка по умолчанию',
//     )));

//   Card.findByIdAndRemove(cardId)
//     .then((card) => {
//       const id = req.user._id;
//       if (!card) {
//         return next(new NotFoundError(
//           ' Карточка с указанным _id не найдена',
//         ));
//       } if (String(card.owner) !== String(id)) {
//         return next(res
//           .status(403)
//           .json({ message: 'Переданы некорректные данные' }));
//       }
//       return res.send({ data: card });
//     })
//     .catch(() => next(new DefaultErore(
//       'Ошибка по умолчанию',
//     )));
// };

module.exports.addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, {
    new: true,
    runValidators: true,
  })
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

module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: id } }, {
    new: true,
    runValidators: true,
  })
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
