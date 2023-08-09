const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// const ERROR_CODE = 400;
// const ERROR_CODE = 404;
// const ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
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

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return (res.status(400).send({ message: 'Ошибка по умолчанию' }));
  }
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.updateUserInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((update) => {
      if (!update) { return res.status(404).send({ message: 'Пользователь по указанному _id не найден' }); }
      return res.status(200).send({ data: update });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка по умолчанию' });
      } else { res.status(500).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((update) => {
      if (!update) { res.status(404).send({ message: 'Пользователь по указанному _id не найден' }); }
      else { res.status(200).send({ data: update }); }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка по умолчанию' });
      } else { res.status(500).send({ message: 'Ошибка по умолчанию' }); }
    });
};
