const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

// const handleAuthError = (res) => {
//   res
//     .status(401)
//     .send({ message: 'Необходима авторизация' });
// };

// const handleAuthError = (err, res, next) => {
//   const statusCode = err.statusCode || 401;

//   const message = statusCode === 401 ? 'Необходима авторизация' : err.message;
//   res.status(statusCode).send({ message });
//   next();
// };

const auth = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization || !authorization.startsWith('')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload._id; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = auth;
