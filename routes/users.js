const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const {
  getUsers, createUsers, getUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

// роут users
router.get('/users', getUsers);

router.post('/users', createUsers);

// роут /users/:userId
router.get('/users/:userId', getUser);

// роут /users/me
router.patch('/users/me', body('name').isLength({
  min: 2,
  max: 30,
}), body('aboute').isLength({
  min: 2,
  max: 30,
}), updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
