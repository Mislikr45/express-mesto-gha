const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar
} = require('../controllers/users');

// роут users
router.get('/users', auth, getUsers);

// роут /users/:userId
router.get('/users/:userId', auth, getUser);

// роут /users/me
router.patch('/users/me', auth, updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
