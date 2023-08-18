const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

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
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = auth;
