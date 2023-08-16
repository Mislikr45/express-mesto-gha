const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const auth = (req, res, next) => {
  const authorization = req.cookies.jwt;
  // res.send(authorization);
  if (!authorization || !authorization.startsWith('')) {
    return handleAuthError(res.status(401).send({ message: 'Необходима авторизация' }));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }
  res.send({ message: 'кукуево' });
  req.user = payload._id; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
