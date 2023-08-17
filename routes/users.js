const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getMe,
} = require('../controllers/users');

const { url } = require('../utils/constants');

router.get('/users/me', auth, getMe);

// роут users
router.get('/users', auth, getUsers);

// роут /users/:userId
router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

// роут /users/me
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(url),
  }),
}), updateUserAvatar);

module.exports = router;
