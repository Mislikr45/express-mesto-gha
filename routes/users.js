const router = require('express').Router();
const { body } = require('express-validator');

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
}), body('about').isLength({
  min: 2,
  max: 30,
}), updateUserInfo);

// роут /users/me/avatar
router.patch('/users/me/avatar', updateUserAvatar);
router.patch((req, res) => { res.status(404).send({ message: 'Ресурс не найден' }); });

module.exports = router;
