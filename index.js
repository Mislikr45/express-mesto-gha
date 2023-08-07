const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
app.get('/' (req, res) => {res.send(hello);})


app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});