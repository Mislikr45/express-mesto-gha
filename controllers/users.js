const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const validator = require('validator');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then( (hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((usernew) => res.status(201).send(usernew))
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

// module.exports.getUser = (req, res) => {
//   const { userId } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return (res.status(ERROR_CODE_400).send({ message: 'Ошибка по умолчанию' }));
//   }
//   return User.findById(userId)
//     .then((user) => {
//       if (!user) {
//         res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
//       } else {
//         res.send({ data: user });
//       }
//     })
//     .catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
// };

module.exports.getUser = (req, res) => {
  const { token } = req.cookies;
  const payload = jwt.decode(token);
  User.findById(payload).then((getUser) => {
    if (!getUser) {
      res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
    } else { res.send({ data: getUser }); }
  })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((update) => {
      if (!update) { return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' }); }
      return res.send({ data: update });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Ошибка по умолчанию' });
      } else { res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((update) => {
      if (!update) {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      } else { res.send({ data: update }); }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Ошибка по умолчанию' });
      } else { res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }); }
    });
};
