const jwt = require('jsonwebtoken');

const handleAuthError = (err, res, next) => {
  const statusCode = err.statusCode || 401;

  const message = statusCode === 401 ? 'Необходима авторизация' : err.message;
  res.status(statusCode).send({ message });
  next();
};

const auth = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization || !authorization.startsWith('')) {
    return handleAuthError(res);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload._id; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = auth;
