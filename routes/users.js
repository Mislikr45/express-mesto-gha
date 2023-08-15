const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar
} = require('../controllers/users');

// роут users
router.get('/users', getUsers);

// роут /users/:userId
router.get('/users/:userId', getUser);

// роут /users/me
router.patch('/users/me', updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
