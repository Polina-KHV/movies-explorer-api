const { Joi } = require('celebrate');
const { regex } = require('../config/config');

const movieSchema = Joi.object().keys({
  nameRU: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie Russian Name Field',
    'any.required': 'Please Fill Movie Russian Name Field',
  }),
  nameEN: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie English Name Field',
    'any.required': 'Please Fill Movie English Name Field',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie Country Field',
    'any.required': 'Please Fill Movie Country Field',
  }),
  director: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie Director Field',
    'any.required': 'Please Fill Movie Director Field',
  }),
  duration: Joi.number().required().messages({
    'number.base': 'Movie Duration must be a number',
    'number.empty': 'Please Fill Movie Duration Field',
    'any.required': 'Please Fill Movie Duration Field',
  }),
  year: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie Year Field',
    'any.required': 'Please Fill Movie Year Field',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Please Fill Movie Description Field',
    'any.required': 'Please Fill Movie Description Field',
  }),
  image: Joi.string().required().pattern(regex.url).messages({
    'string.empty': 'Please Fill Movie Image Field',
    'any.required': 'Please Fill Movie Image Field',
    'string.pattern.base': 'Please Enter A Valid Image Link',
  }),
  trailerLink: Joi.string().required().pattern(regex.url).messages({
    'string.empty': 'Please Fill Movie Trailer Field',
    'any.required': 'Please Fill Movie Trailer Field',
    'string.pattern.base': 'Please Enter A Valid Trailer Link',
  }),
  thumbnail: Joi.string().required().pattern(regex.url).messages({
    'string.empty': 'Please Fill Movie Thumbnail Field',
    'any.required': 'Please Fill Movie Thumbnail Field',
    'string.pattern.base': 'Please Enter A Valid Thumbnail Link',
  }),
  movieId: Joi.number().required().messages({
    'number.base': 'Movie Id must be a number',
    'number.empty': 'Please Fill Movie Id Field',
    'any.required': 'Please Fill Movie Id Field',
  }),
});

const movieIdSchema = Joi.object().keys({
  _id: Joi.string().required().pattern(regex.objectId).messages({
    'any.required': 'Movie Id Is Required',
    'string.pattern.base': 'Please Enter A Valid Movie Id',
  }),
});

module.exports = {
  movieSchema,
  movieIdSchema,
};
