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
      const payload = { _id: user._id };
      const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '7d' });

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days
      res.send({ user, token });
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
    .then((usernew) => res.status(201).send({
      _id: usernew._id,
      email: usernew.email,
      name: usernew.name,
      about: usernew.about,
      avatar: usernew.avatar,
    }))
    .catch((err) => {
      if (err.name === 11000) {
        return res.send.status(409)({ message: 'пользователь с таким email существует' });
      }
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
//   const { token } = req.cookies;
//   const payload = jwt.decode(token);
//   User.findById(payload).then((getUser) => {
//     if (!getUser) {
//       res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
//     } else { res.send({ data: getUser }); }
//   })
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

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return (res.status(ERROR_CODE_400).send({ message: 'Ошибка по умолчанию' }));
  }
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ data: user });
      }
    }).catch(() => res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const token = req.cookies.jwt;
  const payload = jwt.decode(token);
  User.findByIdAndUpdate(payload._id,
    { name, about },
  ).then((update) => {
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
  const errors = validationResult(req);
  const token = req.cookies.jwt;
  const payload = jwt.decode(token);
  User.findByIdAndUpdate(payload._id,
      { avatar },
      { new: true, runValidators: true })
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
