const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors} = require('celebrate');
const routesUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const url = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  'mongodb://0.0.0.0:27017/mestodb',
  { useNewUrlParser: true },
);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64cfd01b51cfacacd06051c0',
//   };

//   next();
// });

// app.use((req, res, next) => {
//   if (req.url === '/signup' || req.url === '/signin') {
//     next(); // Skip auth for signup and signin
//   } else {
//     auth(req, res, next); // Apply authMiddleware for other routes
//   }
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    email: Joi.string().required().email(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(url),
  }),
}), createUser);

app.use(routesUser);
app.use(routerCards);
app.use((req, res) => { res.status(404).send({ message: 'Ресурс не найден' }); });
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});
app.listen(PORT, () => { });
