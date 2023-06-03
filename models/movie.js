const mongoose = require('mongoose');
const { regex } = require('../config/config');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: [true, 'Please Fill Movie Russian Name Field'],
  },
  nameEN: {
    type: String,
    required: [true, 'Please Fill Movie English Name Field'],
  },
  country: {
    type: String,
    required: [true, 'Please Fill Movie Country Field'],
  },
  director: {
    type: String,
    required: [true, 'Please Fill Movie Director Field'],
  },
  duration: {
    type: Number,
    required: [true, 'Please Fill Movie Duration Field'],
  },
  year: {
    type: String,
    required: [true, 'Please Fill Movie Year Field'],
  },
  description: {
    type: String,
    required: [true, 'Please Fill Movie Description Field'],
  },
  image: {
    type: String,
    required: [true, 'Please Fill Movie Image Field'],
    validate: {
      validator(url) {
        const reg = regex.url;
        return reg.test(url);
      },
      message: 'Please Enter A Valid Image Link',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Please Fill Movie Trailer Field'],
    validate: {
      validator(url) {
        const reg = regex.url;
        return reg.test(url);
      },
      message: 'Please Enter A Valid Trailer Link',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Please Fill Movie Thumbnail Field'],
    validate: {
      validator(url) {
        const reg = regex.url;
        return reg.test(url);
      },
      message: 'Please Enter A Valid Thumbnail Link',
    },
  },
  movieId: {
    type: Number,
    required: [true, 'Please Fill Movie Id Field'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
