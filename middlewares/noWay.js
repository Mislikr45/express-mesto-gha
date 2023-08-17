const noWay = (err, _, res, next) => {
  const statusCode = err.statusCode || 404;

  const message = statusCode === 404 ? 'такой страницы не существует' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = noWay;
