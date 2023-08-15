const router = require('express').Router();
const Auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar
} = require('../controllers/users');

// роут users
router.get('/users', Auth, getUsers);

// роут /users/:userId
router.get('/users/:userId', Auth, getUser);

// роут /users/me
router.patch('/users/me', Auth, updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', Auth, updateUserAvatar);

module.exports = router;
