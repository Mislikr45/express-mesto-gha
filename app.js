const express = require('express');
const cookies = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routesUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { URL_REGEX } = require('./utils/constants');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookies());
app.use(express.json({ extended: true }));
app.use(cors());

mongoose.connect(
  'mongodb://0.0.0.0:27017/mestodb',
  { useNewUrlParser: true },
);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(routesUser);
app.use(routerCards);
app.use(() => { throw new NotFoundError('страница не найдена'); });
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
