const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routesUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes/users');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routesUser);
app.use(routerCards);
app.use((req, res) => { res.status(404).send({ message: 'Ресурс не найден' }); });
app.listen(PORT, () => { });
