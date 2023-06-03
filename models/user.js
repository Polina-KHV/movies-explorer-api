const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../config/errors');
const { WRONG_USER_INFO_MESSAGE } = require('../config/errors/errors-messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please Fill Email Field'],
    unique: [true, 'User With This Email Already Exists'],
    validate: {
      validator: (email) => isEmail(email),
      message: 'Please Enter A Valid Email Adress',
    },
  },
  password: {
    type: String,
    required: [true, 'Please Fill Password Field'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Please Fill User Name Field'],
    minlength: [2, 'User Name Length Must Be More Then 1'],
    maxlength: [30, 'User Name Length Must Not Be More Then 30'],
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(WRONG_USER_INFO_MESSAGE);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(WRONG_USER_INFO_MESSAGE);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
