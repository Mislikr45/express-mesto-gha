const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const routesUser = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  'mongodb://0.0.0.0:27017/mestodb',
  { useNewUrlParser: true },
);

app.use(express.static(path.join(__dirname, 'publick')));

app.use((req, res, next) => {
  req.user = {
    _id: '64cfd01b51cfacacd06051c0',
  };

  next();
});

app.use(routesUser);
app.use(routerCards);
app.listen(PORT, () => { });
