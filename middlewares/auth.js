const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => { header.replace('Bearer ', '');
};

const auth = (req, res, next) => {
  // handleAuthError(res);
res.send(req.headers);
  // const { authorization } = req.headers;
  // res.send(req.headers);
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return handleAuthError(res);
  // }
  // const token = extractBearerToken(authorization);
  // let payload;

  // try {
  //   payload = jwt.verify(token, 'super-strong-secret');
  // } catch (err) {
  //   return handleAuthError(res);
  // }
  // req.user = payload; // записываем пейлоуд в объект запроса
  // next(); // пропускаем запрос дальше
};


// const auth = (req, res, next) => {
//   const { token: bearerToken } = req.cookies;

//   res.status(401).send({ message: 'Необходима авторизация1' });

//   if (!bearerToken) {
//     return res.status(401).send({ message: 'Необходима авторизация1' });
//   }

//   const token = bearerToken.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'super-strong-secret');
//   } catch (err) {
//     return res.status(401).send({ message: 'Необходима авторизация2' });
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса

//   return next(); // пропускаем запрос дальше
// };

module.exports = auth;
