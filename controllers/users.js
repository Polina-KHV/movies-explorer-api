const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require('../config/errors');
const {
  USER_NOT_FOUD_MESSAGE,
  EMAIL_ALREADY_EXISTS_MESSAGE,
} = require('../config/errors/errors-messages');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send(user);
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.clearCookie('jwt')
        .send(user);
    })
    .catch((e) => {
      if (e.name === 'DocumentNotFoundError') {
        next(new NotFoundError(USER_NOT_FOUD_MESSAGE));
      } else {
        next(e);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'DocumentNotFoundError') {
        next(new NotFoundError(USER_NOT_FOUD_MESSAGE));
      } else {
        next(e);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS_MESSAGE));
      } else if (e.name === 'ValidationError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        next(new BadRequestError(message));
      } else {
        next(e);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        next(new BadRequestError(message));
      } else if (e.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS_MESSAGE));
      } else if (e.name === 'DocumentNotFoundError') {
        next(new NotFoundError(USER_NOT_FOUD_MESSAGE));
      } else {
        next(e);
      }
    });
};

module.exports = {
  login,
  logout,
  getUser,
  createUser,
  updateUserInfo,
};
