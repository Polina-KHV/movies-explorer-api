const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, isCelebrateError } = require('celebrate');
const { global, db } = require('./config/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { userFullInfoSchema, userLoginSchema } = require('./middlewares/user-validation');
const auth = require('./middlewares/auth');
const rateLimiter = require('./middlewares/rateLimiter');
const { login, createUser, logout } = require('./controllers/users');
const { userRouter, movieRouter } = require('./routes');
const { NotFoundError, BadRequestError } = require('./config/errors');
const { WRONG_PATH_MESSAGE, SERVER_MESSAGE } = require('./config/errors/errors-messages');

const { NODE_ENV, DB_URL } = process.env;

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://localhost:3001',
    'http://158.160.1.215',
    'https://158.160.1.215',
    'http://daechwita.nomoredomains.rocks',
    'https://daechwita.nomoredomains.rocks',

  ],
  allowedHeaders: ['Content-Type'],
  preflightContinue: false,
  credentials: true,
}));
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? DB_URL : db.url);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

app.use(requestLogger);

app.post('/signup', celebrate({ body: userFullInfoSchema }), createUser);
app.post('/signin', celebrate({ body: userLoginSchema }), login);
app.post('/signout', auth, logout);
app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError(WRONG_PATH_MESSAGE));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    let message;
    if (err.details.has('body')) {
      message = err.details.get('body').details.map((details) => details.message).join('; ');
    } else if (err.details.has('params')) {
      message = err.details.get('params').details.map((details) => details.message).join('; ');
    }
    next(new BadRequestError(message));
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? SERVER_MESSAGE
        : message,
    });
  next();
});

app.listen(global.PORT, () => {
  console.log('Server started on port', global.PORT);
});
